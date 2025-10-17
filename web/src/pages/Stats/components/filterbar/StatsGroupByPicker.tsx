import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid,
    Typography,
} from "@mui/material";
import React from "react";
import type { GroupDim } from "./FilterBar";
import { DIM_LABEL } from "./FilterBar";

type StatsGroupByPickerProps = {
    open: boolean;
    onClose: () => void;
    categorizeBy: GroupDim | null;
    groupBy: Set<GroupDim>;
    onApply: (categorizeBy: GroupDim | null, groupBy: Set<GroupDim>) => void;
    disableAgeBand?: boolean;
    disableGender?: boolean;
};

const ALL_DIMS: GroupDim[] = ["zone", "gender", "host_status", "age_band"];

function StatsGroupByPicker({
    open,
    onClose,
    categorizeBy,
    groupBy,
    onApply,
    disableAgeBand,
    disableGender,
}: StatsGroupByPickerProps) {
    const [left, setLeft] = React.useState<GroupDim | null>(categorizeBy);
    const [right, setRight] = React.useState<Set<GroupDim>>(new Set(groupBy));

    React.useEffect(() => {
        setLeft(categorizeBy);
        setRight(new Set(groupBy));
    }, [categorizeBy, groupBy, open]);

    const isDisabled = (dim: GroupDim) =>
        (dim === "age_band" && !!disableAgeBand) || (dim === "gender" && !!disableGender);

    const toggleLeft = (dim: GroupDim) => {
        if (isDisabled(dim)) return;
        // mutual exclusion vs right
        setRight((prev: Set<GroupDim>) => {
            const next = new Set(prev);
            next.delete(dim);
            return next;
        });
        // single-select left
        setLeft((prev: GroupDim | null) => (prev === dim ? null : dim));
    };

    const toggleRight = (dim: GroupDim) => {
        if (isDisabled(dim)) return;
        // mutual exclusion vs left
        setLeft((prev: GroupDim | null) => (prev === dim ? null : prev));
        // multi-select right
        setRight((prev: Set<GroupDim>) => {
            const next = new Set(prev);
            next.has(dim) ? next.delete(dim) : next.add(dim);
            return next;
        });
    };

    const reset = () => {
        setLeft("zone");
        setRight(new Set());
    };

    const apply = () => {
        let nextLeft: GroupDim | null = left;
        const nextRight: Set<GroupDim> = new Set(right);
        // Fallback: if no category selected, default to Zone (if not disabled)
        if (!nextLeft && !isDisabled("zone")) {
            nextLeft = "zone";
        }
        // Ensure mutual exclusion: remove chosen category from right
        if (nextLeft) nextRight.delete(nextLeft);
        onApply(nextLeft, nextRight);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{"Grouped by"}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            {"Categorize (Y-axis)"}
                        </Typography>
                        <FormGroup sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {ALL_DIMS.map((dim) => (
                                <FormControlLabel
                                    key={`left-${dim}`}
                                    control={
                                        <Checkbox
                                            checked={left === dim}
                                            onChange={() => toggleLeft(dim)}
                                            disabled={isDisabled(dim)}
                                        />
                                    }
                                    label={DIM_LABEL[dim] + (isDisabled(dim) ? " (disabled)" : "")}
                                />
                            ))}
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            {"Group bars"}
                        </Typography>
                        <FormGroup sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {ALL_DIMS.map((dim) => (
                                <FormControlLabel
                                    key={`right-${dim}`}
                                    control={
                                        <Checkbox
                                            checked={right.has(dim)}
                                            onChange={() => toggleRight(dim)}
                                            disabled={isDisabled(dim)}
                                        />
                                    }
                                    label={DIM_LABEL[dim] + (isDisabled(dim) ? " (disabled)" : "")}
                                />
                            ))}
                        </FormGroup>
                    </Grid>
                </Grid>
                <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
                    {
                        "Left is single-select. Right is multi-select. A dimension cannot be on both sides. Age range is disabled while an Age filter (Child/Adult or ranges) is active. Gender is disabled while a specific gender filter (only Male or only Female) is active."
                    }
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={reset}>{"Reset"}</Button>
                <Button onClick={apply} variant="contained">
                    {"Apply"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default StatsGroupByPicker;
