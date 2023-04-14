import {Box, Typography} from "@mui/material";
import {SeedWizardDisplay} from "./SeedWizardDisplay";
export const SeedsDisplay = ({seeds}) => {


    return (
        <Box>
            <Box py={1}>
                <Typography variant={'h3'}>
                    All Plants
                </Typography>
            </Box>
            <Box>
                <DisplayOverallInfo seeds={seeds} />
            </Box>

        </Box>

    )
}

export const getCategoryInfo = (seeds) => {
    if (!!seeds) {
        const veg = seeds.filter(seed => seed.category === "Vegetable")
        const fruits = seeds.filter(seed => seed.category === "Herb")
        const herbs = seeds.filter(seed => seed.category === "Fruit")
        const flowers = seeds.filter(seed => seed.category === "Flower")
        return {veg, fruits, herbs, flowers}
    } else {
        return {veg: [], fruits: [], herbs: [], flowers: []}
    }
}

export const DisplayOverallInfo = ({seeds}) => {
    const allCategories = getCategoryInfo(seeds)
    return (
        <Box>
            <Typography variant={'h6'} fontWeight={600}>
                Total Unique Plants: {seeds.length}
            </Typography>
            <Typography>
                Total Vegetable Varieties: {allCategories.veg.length}
            </Typography>
            <Typography>
                Total Fruit Varieties: {allCategories.fruits.length}
            </Typography>
            <Typography>
                Total Flower Varieties: {allCategories.flowers.length}
            </Typography>
            <Typography>
                Total Herb Varieties: {allCategories.herbs.length}
            </Typography>
        </Box>
    )
}

export const SeedsList = ({seeds}) => {
    return (
        <Box>
            {seeds.map(seed => {
                return (
                    <Typography>
                        {seed.subcategory} || {seed.name}
                    </Typography>
                )
            })}
        </Box>
    )
}