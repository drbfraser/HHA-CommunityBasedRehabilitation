import React from "react";
import { Chip } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { ISuccessStory, storyStatusLabel, storyStatusChipColor } from "util/successStories";
import TimelineEntry from "../Timeline/TimelineEntry";
import { SummaryContainer } from "./Entry.styles";
import history from "@cbr/common/util/history";

interface IEntryProps {
    story: ISuccessStory;
}

const SuccessStoryEntry = ({ story }: IEntryProps) => {
    const Summary = () => (
        <SummaryContainer>
            <b>Success Story</b> — {story.written_by_name || "Untitled"}
            <Chip
                label={storyStatusLabel(story.status)}
                color={storyStatusChipColor(story.status)}
                size="small"
                sx={{ ml: 1 }}
            />
        </SummaryContainer>
    );

    return (
        <TimelineEntry
            date={story.date}
            content={<Summary />}
            DotIcon={AutoStoriesIcon}
            onClick={() => history.push(`/client/${story.client_id}/stories/${story.id}`)}
        />
    );
};

export default SuccessStoryEntry;
