import React, { Reducer, useEffect, useReducer, useRef, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    LinearProgress,
    SxProps,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { useIsMounted } from "util/hooks/useIsMounted";
import { helperImgCompress } from "components/ReferralPhotoView/imgCompressHelper";
import { photoViewUploadStyles } from "./PhotoViewUpload.styles";

interface IProps {
    isEditing: boolean;
    /**
     * The client ID if this image is for an existing client.
     */
    clientId?: string;
    onPictureChange: (newPictureURL: string) => void;
    /**
     * Indicates either a base64 image starting with `data:image/png;base64` or a (non-accessible)
     * URL to an image on the server.
     */
    picture: string | null;
}

interface ICropperModal {
    onPictureChange: (newPictureURL: string) => void;
}

const DEFAULT_IMAGE_PATH = "/images/profile_pic_icon.png";

type TReducerAction = { newImgSrc: string };

const imgSrcReducer: Reducer<string, TReducerAction> = (prevImgSrc, { newImgSrc }): string => {
    if (prevImgSrc === newImgSrc) {
        return prevImgSrc;
    }

    if (prevImgSrc.startsWith("blob:")) {
        URL.revokeObjectURL(prevImgSrc);
    }

    return newImgSrc;
};

export const ProfilePicCard = (props: IProps) => {
    const isMounted = useIsMounted();

    const profilePicRef = useRef<HTMLInputElement | null>(null);

    const [isViewingPicture, setIsViewingPicture] = useState<boolean>(false);
    const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);

    const [cropperPictureState, dispatchCropperPictureState] = useReducer(imgSrcReducer, "");

    const [imgSrcState, dispatchImgSrcState] = useReducer(
        imgSrcReducer,
        !props.picture ? DEFAULT_IMAGE_PATH : "",
    );
    useEffect(() => {
        return () => {
            if (!isMounted() && imgSrcState.startsWith("blob:")) {
                URL.revokeObjectURL(imgSrcState);
            }
        };
    }, [isMounted, imgSrcState]);
    const hasLoadedImage = useRef(false);
    useEffect(() => {
        if (!props.picture && !hasLoadedImage.current) {
            // `!props.picture` means the client didn't have a picture initially. If we've never
            // loaded an image, don't attempt a network request that is likely to 404.
            return;
        }

        if (props.picture && props.picture.startsWith("blob:")) {
            hasLoadedImage.current = true;
            dispatchImgSrcState({ newImgSrc: props.picture });
        } else if (props.clientId && !props.isEditing) {
            const abortController = new AbortController();
            // Note that we refetch the image if the client state changes (and we don't have a local
            // blob to use)
            apiFetch(Endpoint.CLIENT_PICTURE, `${props.clientId}`)
                .then((resp) => resp.blob())
                .then((blob) => {
                    hasLoadedImage.current = true;
                    dispatchImgSrcState({ newImgSrc: URL.createObjectURL(blob) });
                })
                .catch((e) => {
                    console.error(e);
                    dispatchImgSrcState({ newImgSrc: DEFAULT_IMAGE_PATH });
                });

            return () => abortController.abort();
        }
    }, [props.clientId, props.picture, props.isEditing]);

    const PictureModal = () => {
        return (
            <Dialog open={isViewingPicture} onClose={() => setIsViewingPicture(false)}>
                <DialogContent>
                    <Box
                        component="img"
                        sx={photoViewUploadStyles.pictureModal}
                        src={imgSrcState}
                        alt="user-profile-pic"
                        onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== DEFAULT_IMAGE_PATH) {
                                dispatchImgSrcState({ newImgSrc: DEFAULT_IMAGE_PATH });
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setIsViewingPicture(false)}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const CropModal = (cropperProps: ICropperModal) => {
        const cropper = useRef<Cropper | null>(null);

        const [isSaving, setIsSaving] = useState(false);
        const isMounted = useIsMounted();

        const handleExit = () => {
            setCropModalOpen(false);
            dispatchCropperPictureState({ newImgSrc: "" });
        };

        return (
            <Dialog
                open={cropModalOpen}
                onClose={() => {
                    setCropModalOpen(false);
                }}
                aria-labelledby="form-modal-title"
            >
                <DialogContent>
                    {cropperPictureState ? (
                        <Cropper
                            style={{ height: 400, width: "100%" }}
                            responsive={true}
                            minCropBoxHeight={10}
                            minCropBoxWidth={10}
                            viewMode={1}
                            aspectRatio={1}
                            src={cropperPictureState}
                            background={false}
                            onInitialized={(instance) => {
                                cropper.current = instance;
                            }}
                        />
                    ) : (
                        <LinearProgress />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={isSaving || !cropperPictureState}
                        onClick={() => {
                            if (!cropper.current) {
                                alert("Failed to get image!");
                                return;
                            }

                            setIsSaving(true);
                            cropper.current.getCroppedCanvas().toBlob((blob: Blob | null) => {
                                if (!isMounted()) {
                                    return;
                                }

                                if (blob) {
                                    cropperProps.onPictureChange(URL.createObjectURL(blob));
                                } else {
                                    alert("Failed to get image!");
                                }
                                setIsSaving(false);
                                handleExit();
                            });
                        }}
                    >
                        Save
                        {isSaving && (
                            <CircularProgress color="primary" size={15} style={{ marginLeft: 5 }} />
                        )}
                    </Button>
                    <Button variant="outlined" color="primary" onClick={handleExit}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const files = e.target.files;
        if (!files) {
            return;
        }

        const reader = new FileReader();

        let target_file = await helperImgCompress(files[0]);

        reader.onload = () => {
            const cropperPicture = (reader.result as ArrayBuffer) ?? undefined;
            if (cropperPicture) {
                const blob = new Blob([cropperPicture]);
                dispatchCropperPictureState({ newImgSrc: URL.createObjectURL(blob) });
            } else {
                alert("Error opening image");
            }
        };

        reader.readAsArrayBuffer(target_file);
        setCropModalOpen(true);

        // Allow image reuse when selecting in file picker again.
        // @ts-ignore
        e.target.value = null;
    };

    const triggerFileUpload = () => {
        profilePicRef.current!.click();
    };

    return (
        <>
            <Card
                sx={
                    !props.isEditing
                        ? photoViewUploadStyles.profileImgContainer
                        : ({
                              ...photoViewUploadStyles.profileImgContainer,
                              ...photoViewUploadStyles.profileUploadHover,
                          } as SxProps)
                }
            >
                <CardContent
                    onClick={() =>
                        !props.isEditing ? setIsViewingPicture(true) : triggerFileUpload()
                    }
                >
                    {imgSrcState && (
                        <Box
                            component="img"
                            sx={photoViewUploadStyles.profilePicture}
                            src={imgSrcState}
                            alt="user-icon"
                            onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src !== DEFAULT_IMAGE_PATH) {
                                    dispatchImgSrcState({ newImgSrc: DEFAULT_IMAGE_PATH });
                                }
                            }}
                        />
                    )}
                    <Box id="uploadIcon" sx={photoViewUploadStyles.uploadIcon}>
                        <CloudUploadIcon />
                        <input
                            type="file"
                            accept="image/*"
                            ref={profilePicRef}
                            style={{ visibility: "hidden" }}
                            onChange={onSelectFile}
                        />
                    </Box>
                </CardContent>
            </Card>
            <PictureModal />
            <CropModal onPictureChange={props.onPictureChange} />
        </>
    );
};
