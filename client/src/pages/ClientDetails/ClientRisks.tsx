import React from "react";

import { Grid, Card, CardActions, CardContent, Typography, Button } from "@material-ui/core";

const ClientRisks = (props: any) => {
    return (
        <>
            <Grid container spacing={5} direction="row" justify="flex-start">
                <Grid item md={4} xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h1">
                                Health Risk
                            </Typography>
                            <br />
                            <Typography variant="subtitle2" component="h6">
                                Requirements:
                            </Typography>
                            <Typography variant="body2" component="p">
                                {props.healthRisk ? props.healthRisk.requirement : ""}
                            </Typography>
                            <br />
                            <Typography variant="subtitle2" component="h6">
                                Goals:
                            </Typography>
                            <Typography variant="body2" component="p">
                                {props.healthRisk ? props.healthRisk.goal : ""}
                            </Typography>
                        </CardContent>
                        <CardActions style={{ float: "right" }}>
                            <Button variant="contained" color="primary" size="small">
                                Update
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h1">
                                Social Risk
                            </Typography>
                            <br />
                            <Typography variant="subtitle2" component="h6">
                                Requirements:
                            </Typography>
                            <Typography variant="body2" component="p">
                                {props.socialRisk ? props.socialRisk.requirement : ""}
                            </Typography>
                            <br />
                            <Typography variant="subtitle2" component="h6">
                                Goals:
                            </Typography>
                            <Typography variant="body2" component="p">
                                {props.socialRisk ? props.socialRisk.goal : ""}
                            </Typography>
                        </CardContent>
                        <CardActions style={{ float: "right" }}>
                            <Button variant="contained" color="primary" size="small">
                                Update
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h1">
                                Education Risk
                            </Typography>
                            <br />
                            <Typography variant="subtitle2" component="h6">
                                Requirements:
                            </Typography>
                            <Typography variant="body2" component="p">
                                {props.educatRisk ? props.educatRisk.requirement : ""}
                            </Typography>
                            <br />
                            <Typography variant="subtitle2" component="h6">
                                Goals:
                            </Typography>
                            <Typography variant="body2" component="p">
                                {props.educatRisk ? props.educatRisk.goal : ""}
                            </Typography>
                        </CardContent>
                        <CardActions style={{ float: "right" }}>
                            <Button variant="contained" color="primary" size="small">
                                Update
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default ClientRisks;
