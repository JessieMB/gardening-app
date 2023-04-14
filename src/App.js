import './App.css';
import {SeedsDisplay} from "./views/SeedsDisplay";
import {seeds} from "./seeds";
import EnhancedTable from "./components/Table";
import {Box, Button, Container, Divider} from "@mui/material";
import {DateTime} from "luxon";
import {useEffect, useState} from "react";
import {sortItems} from "./util/seeds-util";

function App() {
    const [sortedSeeds, setSortedSeeds] = useState(sortItems(seeds, 'subcategory', 'name'))
    console.log(sortedSeeds)
    useEffect(() => {
        const sorted = sortItems(seeds, 'subcategory', 'name')
        setSortedSeeds(sorted)
    }, [seeds])


    return (
    <div className="App">
        <Container maxWidth={'xl'}>
            <SeedsDisplay seeds={seeds} />
            <Box py={1}>
                <Divider variant={'inset'} />
            </Box>
            <EnhancedTable seeds={seeds} />
        </Container>
    </div>
  );
}

export default App;
