import React, { useEffect, useState } from "react";
import {
    Box,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import history from "@cbr/common/util/history";
import { getAllStories, ISuccessStory, StoryStatus, seedMockStories } from "util/successStories";

const SuccessStoriesList = () => {
    const [stories, setStories] = useState<ISuccessStory[]>([]);

    useEffect(() => {
        // TODO: remove seedMockStories once real data exists
        // Seed a couple of demo client IDs so the list isn't empty
        seedMockStories("1");
        seedMockStories("2");
        setStories(getAllStories().sort((a, b) => b.created_at - a.created_at));
    }, []);

    return (
        <>
            <Typography variant="h4" sx={{ mb: 2 }}>
                All Success Stories
            </Typography>

            {stories.length === 0 ? (
                <Typography color="text.secondary">
                    No success stories have been submitted yet.
                </Typography>
            ) : (
                <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <b>Written By</b>
                                </TableCell>
                                <TableCell>
                                    <b>Date</b>
                                </TableCell>
                                <TableCell>
                                    <b>Diagnosis</b>
                                </TableCell>
                                <TableCell>
                                    <b>Status</b>
                                </TableCell>
                                <TableCell>
                                    <b>Permission</b>
                                </TableCell>
                                <TableCell align="right">
                                    <b>Actions</b>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stories.map((story) => (
                                <TableRow key={story.id} hover>
                                    <TableCell>{story.written_by_name || "—"}</TableCell>
                                    <TableCell>{story.date}</TableCell>
                                    <TableCell>{story.diagnosis || "—"}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={
                                                story.status === StoryStatus.READY ? "Ready" : "WIP"
                                            }
                                            color={
                                                story.status === StoryStatus.READY
                                                    ? "success"
                                                    : "warning"
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{story.publish_permission}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="View">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    history.push(
                                                        `/client/${story.client_id}/stories/${story.id}`
                                                    )
                                                }
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    history.push(
                                                        `/client/${story.client_id}/stories/${story.id}/edit`
                                                    )
                                                }
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
};

export default SuccessStoriesList;
