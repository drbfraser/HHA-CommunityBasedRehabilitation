import React, { Reducer, useEffect, useReducer, useRef, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    LinearProgress,
    Snackbar,
    SxProps,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { useIsMounted } from "util/hooks/useIsMounted";
import { canvasToJpeg, PhotoSize, RECORD_PHOTO_SIZE, resizePhoto } from "util/resizePhoto";
import { ImageViewerDialog } from "components/ImageViewer/ImageViewerDialog";
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

// The photo shown in the cropper: large enough to crop precisely, high quality so the final
// 400 px crop is not noticeably re-compressed.
const CROPPER_PHOTO_SIZE: PhotoSize = { maxSide: 1500, quality: 0.92 };

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
    const [showNoPictureHint, setShowNoPictureHint] = useState<boolean>(false);
    const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);

    const [cropperPictureState, dispatchCropperPictureState] = useReducer(imgSrcReducer, "");

    const [imgSrcState, dispatchImgSrcState] = useReducer(
        imgSrcReducer,
        !props.picture ? DEFAULT_IMAGE_PATH : ""
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

    const hasPicture = Boolean(imgSrcState) && imgSrcState !== DEFAULT_IMAGE_PATH;

    const onPictureClick = () => {
        if (props.isEditing) {
            triggerFileUpload();
        } else if (hasPicture) {
            setIsViewingPicture(true);
        } else {
            setShowNoPictureHint(true);
        }
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
                            const croppedCanvas = cropper.current.getCroppedCanvas({
                                maxWidth: RECORD_PHOTO_SIZE.maxSide,
                                maxHeight: RECORD_PHOTO_SIZE.maxSide,
                                fillColor: "#fff",
                                imageSmoothingQuality: "high",
                            });
                            canvasToJpeg(croppedCanvas, RECORD_PHOTO_SIZE.quality)
                                .then((blob) => {
                                    if (isMounted()) {
                                        cropperProps.onPictureChange(URL.createObjectURL(blob));
                                    }
                                })
                                .catch(() => alert("Failed to get image!"))
                                .finally(() => {
                                    if (isMounted()) {
                                        setIsSaving(false);
                                        handleExit();
                                    }
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
        if (!files || !files[0]) {
            return;
        }
        const file = files[0];

        // Allow image reuse when selecting in file picker again.
        // @ts-ignore
        e.target.value = null;

        setCropModalOpen(true);
        try {
            // Shrink very large photos (and apply their EXIF rotation) so the cropper stays
            // responsive; the crop itself is saved at the final size when the user clicks Save.
            const forCropping = await resizePhoto(file, CROPPER_PHOTO_SIZE);
            dispatchCropperPictureState({ newImgSrc: URL.createObjectURL(forCropping) });
        } catch (error) {
            console.error(error);
            setCropModalOpen(false);
            alert("Could not read this image. Please choose a JPEG or PNG photo.");
        }
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
                <CardContent onClick={onPictureClick}>
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
            <ImageViewerDialog
                open={isViewingPicture && hasPicture}
                onClose={() => setIsViewingPicture(false)}
                images={[{ src: imgSrcState, fileBaseName: `client-${props.clientId ?? "photo"}` }]}
            />
            <Snackbar
                open={showNoPictureHint}
                autoHideDuration={6000}
                onClose={() => setShowNoPictureHint(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="info" onClose={() => setShowNoPictureHint(false)}>
                    No photo yet. To add one, click Edit, then click the photo.
                </Alert>
            </Snackbar>
            <CropModal onPictureChange={props.onPictureChange} />
        </>
    );
};
