import {Box, Button, Divider, Stack, TextField, Typography} from "@mui/material";
import {getDateInfo} from "../util/seeds-util";
import {useEffect} from "react";
import * as React from 'react'

export const SeedWizardDisplay = ({seedData, sqFeetStr, setSqFeetStr, setSeedData}) => {
    const [dateInfo, setDateInfo] = React.useState(getDateInfo())
    const [plotName, setPlotName] = React.useState('')
    const [plots, setPlots] = React.useState([])
    const handleTextChange = (e) => {
        setPlotName(e.target.value)
    }

    const savePlot = () => {
        const plot = {plotName, seedData, squareFeet: sqFeetStr}
        setPlots([plot, ...plots])
        setPlotName('')
        setSeedData(undefined)
        setSqFeetStr('')
    }

    const clearSeedData = () => {
        setSeedData(undefined)
    }

    useEffect(() => {
        console.log(plots)
    }, [plots])

    return (
        <Box>
            <Stack>
                {
                    !!seedData && Object.keys(seedData.length > 0) &&
                    <Box>
                        <TextField value={plotName} onChange={handleTextChange} id="standard-basic" label="Plot Name" variant="standard" />
                        <Typography fontWeight={600} color={'green'}>
                            Total Square Footage: {sqFeetStr}
                        </Typography>
                        <Box py={2}>
                            <Button disabled={plotName === ''} onClick={savePlot} variant={'contained'}>Save Plot</Button>
                            <Button disabled={!seedData} onClick={clearSeedData} variant={'contained'}>Reset Plot</Button>
                        </Box>
                        <Typography>
                            There are {Object.keys(seedData).length} plots, of {Math.floor(parseInt(sqFeetStr) / Object.keys(seedData).length)} square feet each.
                        </Typography>
                        {
                           !!seedData && Object.keys(seedData).map(seed => (
                                <Typography>You can plant {seedData[seed].maxNumPlantsPerPlot} {seed}.</Typography>
                            ))
                        }
                    </Box>
                }
                {!!dateInfo &&
                    <Box py={2}>
                        <Divider variant={'inset'} />
                        <Box py={1}>
                            <Typography fontWeight={600} color={'green'}>
                                Total plants that can be germinated right now: {dateInfo.germinateNow.length}
                            </Typography>
                            {
                                (dateInfo.germinateNow).map(seed => (
                                    <Typography> <strong>{seed.name} {seed.subcategory} </strong> has <strong> {seed.daysLeftToGerminate} </strong> days to be germinated before it is too late for the season!
                                        Please germinate before {seed.latestGerminationDateStr}</Typography>
                                ))
                            }
                        </Box>
                    </Box>
                }

            </Stack>

        </Box>

    )
}
