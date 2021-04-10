import React, { useRef, useState } from "react";
import { Card, CardContent, Dialog, DialogActions, DialogContent, Button } from "@material-ui/core";
import { useStyles } from "./PhotoViewUpload.styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface IPictureModal {
    picture: string;
}

interface IProps {
    isEditing: boolean;
    setFieldValue: (field: string, value: string) => void;
    picture: string;
}

interface ICropperModal {
    setFieldValue: (field: string, value: string) => void;
}

export const ProfilePicCard = (props: IProps) => {
    const styles = useStyles();
    const profilePicRef = useRef<HTMLInputElement | null>(null);
    const cropper = useRef<Cropper>();
    const [isViewingPicture, setIsViewingPicture] = useState<boolean>(false);
    const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
    const [profilePicture, setProfilePicture] = useState("/images/profile_pic_icon.png");

    const PictureModal = (props: IPictureModal) => {
        return (
            <Dialog
                open={isViewingPicture}
                onClose={() => {
                    setIsViewingPicture(false);
                }}
            >
                <DialogContent>
                    <img
                        src={props.picture ? props.picture : "/images/profile_pic_icon.png"}
                        alt="user-profile-pic"
                    />
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

    const CropModal = (props: ICropperModal) => (
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
                            props.setFieldValue(
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
                    <img
                        className={styles.profilePicture}
                        src={props.picture || `/images/profile_pic_icon.png`}
                        alt="user-icon"
                    />
                    <div className={styles.uploadIcon}>
                        <CloudUploadIcon />
                        <input
                            type="file"
                            accept="image/*"
                            ref={profilePicRef}
                            style={{ visibility: "hidden" }}
                            onChange={(e: any) => {
                                onSelectFile(e);
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
            <PictureModal picture={props.picture} />
            <CropModal setFieldValue={props.setFieldValue} />
        </>
    );
};
