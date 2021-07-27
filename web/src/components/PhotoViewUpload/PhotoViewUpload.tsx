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

export const ProfilePicCard = (props: IProps) => {
    const styles = useStyles();
    const profilePicRef = useRef<HTMLInputElement | null>(null);
    const cropper = useRef<Cropper>();
    const [isViewingPicture, setIsViewingPicture] = useState<boolean>(false);
    const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);
    const [cropperPicture, setCropperPicture] = useState<string>();

    const [imgSrc, setImgSrc] = useState<string>();
    useEffect(() => {
        if (!props.picture) {
            setImgSrc(DEFAULT_IMAGE_PATH);
            return;
        }

        if (props.picture && props.picture.startsWith("data:image/png")) {
            setImgSrc(props.picture);
        } else if (props.clientId && !props.isEditing) {
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
    }, [props.clientId, props.picture, props.isEditing]);

    const PictureModal = () => {
        const styles = useStyles();

        return (
            <Dialog open={isViewingPicture} onClose={() => setIsViewingPicture(false)}>
                <DialogContent>
                    <img className={styles.pictureModal} src={imgSrc} alt="user-profile-pic" />
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

    const CropModal = (cropperProps: ICropperModal) => (
        <Dialog
            open={cropModalOpen}
            onClose={() => {
                setCropModalOpen(false);
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
                    src={cropperPicture}
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
                            cropperProps.onPictureChange(
                                cropper.current.getCroppedCanvas().toDataURL()
                            );
                        }
                        setCropModalOpen(false);
                        setCropperPicture(undefined);
                    }}
                >
                    Save
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        setCropModalOpen(false);
                        setCropperPicture(undefined);
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const files = e.target.files;
        if (!files) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const cropperPicture = (reader.result as string) ?? undefined;
            setCropperPicture(cropperPicture);
            if (cropperPicture) {
                setCropModalOpen(true);
            } else {
                alert("Error opening image");
            }
        };

        reader.readAsDataURL(files[0]);

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
                    {imgSrc && (
                        <img className={styles.profilePicture} src={imgSrc} alt="user-icon" />
                    )}
                    <div className={styles.uploadIcon}>
                        <CloudUploadIcon />
                        <input
                            type="file"
                            accept="image/*"
                            ref={profilePicRef}
                            style={{ visibility: "hidden" }}
                            onChange={onSelectFile}
                        />
                    </div>
                </CardContent>
            </Card>
            <PictureModal />
            <CropModal onPictureChange={props.onPictureChange} />
        </>
    );
};
