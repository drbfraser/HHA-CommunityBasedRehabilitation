import { GridOverlay, ValueFormatterParams } from "@material-ui/data-grid";
import {
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { useDataGridStyles } from "styles/DataGrid.styles";

export const RenderText = (params: ValueFormatterParams) => {
  return <Typography variant={"body2"}>{params.value}</Typography>;
};

export const RenderLoadingOverlay = () => {
  return (
      <GridOverlay>
          <div style={{ position: "absolute", top: 0, width: "100%" }}>
              <LinearProgress />
          </div>
      </GridOverlay>
  );
};

export const RenderNoRowsOverlay = () => {
  const styles = useDataGridStyles();

  return (
      <GridOverlay className={styles.noRows}>
          <Cancel color="primary" className={styles.noRowsIcon} />
          <Typography color="primary">No Clients Found</Typography>
      </GridOverlay>
  );
};

