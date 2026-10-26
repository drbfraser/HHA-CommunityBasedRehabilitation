import React, { useEffect, useState } from "react";
import { Box, Dialog, IconButton, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DownloadIcon from "@mui/icons-material/Download";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export interface IViewerImage {
    /** URL of the image (usually a blob: URL of an image fetched with the user's login). */
    src: string;
    /** Download file name without extension, e.g. "visit-123"; the extension comes from the image type. */
    fileBaseName: string;
    alt?: string;
}

interface IProps {
    open: boolean;
    onClose: () => void;
    images: IViewerImage[];
    initialIndex?: number;
}

const extensionFor = (mimeType: string) => {
    const subtype = mimeType.split("/")[1] ?? "";
    if (subtype === "jpeg" || subtype === "") {
        return "jpg";
    }
    return subtype.replace("svg+xml", "svg");
};

const downloadImage = async (image: IViewerImage) => {
    const blob = await (await fetch(image.src)).blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${image.fileBaseName}.${extensionFor(blob.type)}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
};

const toolbarButtonSx = { color: "inherit" };

/**
 * Shows images large, with zoom (mouse wheel, pinch, double-click or the buttons), drag to pan,
 * download, and previous/next (buttons or arrow keys) when there are several images.
 */
export const ImageViewerDialog = ({ open, onClose, images, initialIndex = 0 }: IProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [index, setIndex] = useState(initialIndex);
    const hasMany = images.length > 1;

    useEffect(() => {
        if (open) {
            setIndex(initialIndex);
        }
    }, [open, initialIndex]);

    const showPrevious = () => setIndex((i) => (i - 1 + images.length) % images.length);
    const showNext = () => setIndex((i) => (i + 1) % images.length);

    useEffect(() => {
        if (!open || !hasMany) {
            return;
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                showPrevious();
            } else if (event.key === "ArrowRight") {
                showNext();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, hasMany, images.length]);

    const image = images[Math.min(index, images.length - 1)];
    if (!image) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: "#111",
                    color: "#fff",
                    height: fullScreen ? "100%" : "90vh",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* key: start each image unzoomed */}
            <TransformWrapper key={index} minScale={1} maxScale={6} centerOnInit>
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", px: 1, py: 0.5 }}>
                            <Typography sx={{ flex: 1, pl: 1 }} variant="body2">
                                {hasMany ? `${index + 1} / ${images.length}` : ""}
                            </Typography>
                            <Tooltip title="Zoom in">
                                <IconButton sx={toolbarButtonSx} onClick={() => zoomIn()}>
                                    <ZoomInIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Zoom out">
                                <IconButton sx={toolbarButtonSx} onClick={() => zoomOut()}>
                                    <ZoomOutIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Reset zoom">
                                <IconButton sx={toolbarButtonSx} onClick={() => resetTransform()}>
                                    <RestartAltIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                                <IconButton
                                    sx={toolbarButtonSx}
                                    onClick={() =>
                                        downloadImage(image).catch(() =>
                                            alert("Could not download the image.")
                                        )
                                    }
                                >
                                    <DownloadIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Close">
                                <IconButton sx={toolbarButtonSx} onClick={onClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
                            <TransformComponent
                                wrapperStyle={{ width: "100%", height: "100%" }}
                                contentStyle={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt ?? ""}
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            </TransformComponent>
                            {hasMany && (
                                <>
                                    <IconButton
                                        aria-label="Previous image"
                                        onClick={showPrevious}
                                        sx={{
                                            ...toolbarButtonSx,
                                            position: "absolute",
                                            left: 8,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            bgcolor: "rgba(0, 0, 0, 0.4)",
                                        }}
                                    >
                                        <ChevronLeftIcon fontSize="large" />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Next image"
                                        onClick={showNext}
                                        sx={{
                                            ...toolbarButtonSx,
                                            position: "absolute",
                                            right: 8,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            bgcolor: "rgba(0, 0, 0, 0.4)",
                                        }}
                                    >
                                        <ChevronRightIcon fontSize="large" />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    </>
                )}
            </TransformWrapper>
        </Dialog>
    );
};
