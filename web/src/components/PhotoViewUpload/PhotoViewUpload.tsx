import React, { useEffect, useRef, useState } from "react";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { useStyles } from "./PhotoViewUpload.styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";

interface IProps {
    isEditing: boolean;
    /**
     * The client ID if this image is for an existing client.
     */
    clientId?: number;
    setFieldValue: (field: string, value: string) => void;
    /**
     * Indicates either a base64 image starting with `data:image/png;base64` or a (non-accessible)
     * path to an image on the server.
     */
    picture: string | null;
}

interface ICropperModal {
    setFieldValue: (field: string, value: string) => void;
}

const DEFAULT_IMAGE_PATH = "/images/profile_pic_icon.png";

export const ProfilePicCard = (props: IProps) => {
    const styles = useStyles();
    const profilePicRef = useRef<HTMLInputElement | null>(null);
    const cropper = useRef<Cropper>();
    const [isViewingPicture, setIsViewingPicture] = useState<boolean>(false);
    const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
    const [profilePicture, setProfilePicture] = useState(DEFAULT_IMAGE_PATH);

    const [imgSrc, setImgSrc] = useState<string>(DEFAULT_IMAGE_PATH);
    useEffect(() => {
        if (!props.picture) {
            return;
        }

        if (props.picture && props.picture.startsWith("data:image/png")) {
            setImgSrc(props.picture);
        } else if (props.clientId) {
            // Since props.picture is not null, this prop comes from the client info returned by
            // the server API. As client pictures require authentication, we make a cached call
            // to get it.
            const abortController = new AbortController();

            let blobUrlRef: string | undefined;

            apiFetch(Endpoint.CLIENT_PICTURE, `${props.clientId}`, { cache: "no-cache" })
                .then(async (resp) => {
                    const blob = await resp.blob();
                    blobUrlRef = URL.createObjectURL(blob);
                    setImgSrc(blobUrlRef);
                })
                .catch((e) => console.error(e));

            return () => {
                abortController.abort();
                if (blobUrlRef) {
                    URL.revokeObjectURL(blobUrlRef);
                }
            };
        }
    }, [props.clientId, props.picture]);

    const PictureModal = () => {
        const styles = useStyles();

        return (
            <Dialog
                open={isViewingPicture}
                onClose={() => {
                    setIsViewingPicture(false);
                }}
            >
                <DialogContent>
                    <img className={styles.pictureModal} src={imgSrc} alt="user-profile-pic" />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            setIsViewingPicture(false);
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const CropModal = (cropperProps: ICropperModal) => (
        <Dialog
            open={profileModalOpen}
            onClose={() => {
                setProfileModalOpen(false);
            }}
            aria-labelledby="form-modal-title"
        >
            <DialogContent>
                <Cropper
                    style={{ height: 400, width: "100%" }}
                    responsive={true}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    viewMode={1}
                    aspectRatio={1}
                    src={profilePicture}
                    background={false}
                    onInitialized={(instance) => {
                        cropper.current = instance;
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        if (cropper.current !== undefined) {
                            cropperProps.setFieldValue(
                                "picture",
                                cropper.current.getCroppedCanvas().toDataURL()
                            );
                        }
                        setProfileModalOpen(false);
                    }}
                >
                    Save
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        setProfileModalOpen(false);
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );

    const onSelectFile = (e: any) => {
        e.preventDefault();

        let files;

        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        } else {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setProfilePicture(reader.result as any);
        };

        reader.readAsDataURL(files[0]);

        if (profilePicture) {
            setProfileModalOpen(true);
        }

        e.target.value = null;
    };

    const triggerFileUpload = () => {
        profilePicRef.current!.click();
    };

    return (
        <>
            <Card
                className={
                    !props.isEditing
                        ? styles.profileImgContainer
                        : `${styles.profileImgContainer} ${styles.profileUploadHover}`
                }
            >
                <CardContent
                    onClick={() =>
                        !props.isEditing ? setIsViewingPicture(true) : triggerFileUpload()
                    }
                >
                    <img className={styles.profilePicture} src={imgSrc} alt="user-icon" />
                    <div className={styles.uploadIcon}>
                        <CloudUploadIcon />
                        <input
                            type="file"
                            accept="image/*"
                            ref={profilePicRef}
                            style={{ visibility: "hidden" }}
                            onChange={(e) => {
                                onSelectFile(e);
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
            <PictureModal />
            <CropModal setFieldValue={props.setFieldValue} />
        </>
    );
};
