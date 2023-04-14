import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import {Button, Stack, TextField} from "@mui/material";
import {DateTime} from "luxon";
import {getMaxPlantsForSquareFootage} from "../util/seeds-util";
import {SeedWizardDisplay} from "../views/SeedWizardDisplay";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'category',
        numeric: false,
        disablePadding: true,
        label: 'Category',
    },
    {
        id: 'subcategory',
        numeric: false,
        disablePadding: false,
        label: 'Type',
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Variety',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'daysToHarvest',
        numeric: true,
        disablePadding: false,
        label: 'Days to Harvest',
    },
    {
        id: 'minDaysToGerm',
        numeric: true,
        disablePadding: false,
        label: 'Germination Days (min)',
    },
    {
        id: 'maxDaysToGerm',
        numeric: true,
        disablePadding: false,
        label: 'Germination Days (max)',
    },
    {
        id: 'earliestPlantDate',
        numeric: false,
        disablePadding: false,
        label: 'Earliest Planting Date',
    },
    {
        id: 'latestPlantDate',
        numeric: false,
        disablePadding: false,
        label: 'Latest Planting Date',
    },
    {
        id: 'spacingInchesX',
        numeric: true,
        disablePadding: false,
        label: 'Row Spacing (Inches)',
    },
    {
        id: 'spacingInchesY',
        numeric: true,
        disablePadding: false,
        label: 'Hill Spacing (Inches)',
    },
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'ID',
        hidden: true
    },
];

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'earliestPlantDate';
const DEFAULT_ROWS_PER_PAGE = 50;

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (newOrderBy) => (event) => {
        onRequestSort(event, newOrderBy);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        hidden={headCell.hidden}
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected, selected, setSqFtStr, sqFtStr, plottingWizardInfo, setPlottingWizardInfo } = props;
    const printSelected = () => {
        console.log(selected)
    }

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            <Stack direction={'row'} spacing={2}>
                <Box py={1}>
                    <Button onClick={printSelected} disabled={numSelected === 0} variant={'contained'}>
                        Mark as Germinated
                    </Button>
                </Box>
                <Box py={1}>
                    <Button disabled={numSelected === 0} variant={'contained'}>
                        Mark as Planted
                    </Button>
                </Box>
                <Box py={1}>
                    <Button onClick={e => getMaxPlantsForSquareFootage(selected, sqFtStr, plottingWizardInfo, setPlottingWizardInfo)} disabled={numSelected === 0} variant={'contained'}>
                        Plotting Wizard
                    </Button>
                </Box>
                <Box py={1}>
                    <TextField onChange={e => setSqFtStr(e.target.value)} value={sqFtStr} label={'Plot Sq Feet'} />
                </Box>
            </Stack>
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h4"
                    id="tableTitle"
                    component="div"
                >
                    Seed Inventory
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({seeds}) {
    const [order, setOrder] = React.useState(DEFAULT_ORDER);
    const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [visibleRows, setVisibleRows] = React.useState(null);
    const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
    const [paddingHeight, setPaddingHeight] = React.useState(0);
    const [sqFeetStr, setSqFeetStr] = React.useState('')


    React.useEffect(() => {
        let rowsOnMount = stableSort(
            seeds,
            getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
        );

        rowsOnMount = rowsOnMount.slice(
            0 * DEFAULT_ROWS_PER_PAGE,
            0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
        );

        setVisibleRows(rowsOnMount);
    }, []);

    const handleRequestSort = React.useCallback(
        (event, newOrderBy) => {
            const isAsc = orderBy === newOrderBy && order === 'asc';
            const toggledOrder = isAsc ? 'desc' : 'asc';
            setOrder(toggledOrder);
            setOrderBy(newOrderBy);

            const sortedRows = stableSort(seeds, getComparator(toggledOrder, newOrderBy));
            const updatedRows = sortedRows.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            );

            setVisibleRows(updatedRows);
        },
        [order, orderBy, page, rowsPerPage],
    );

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = seeds.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = React.useCallback(
        (event, newPage) => {
            setPage(newPage);

            const sortedRows = stableSort(seeds, getComparator(order, orderBy));
            const updatedRows = sortedRows.slice(
                newPage * rowsPerPage,
                newPage * rowsPerPage + rowsPerPage,
            );

            setVisibleRows(updatedRows);

            // Avoid a layout jump when reaching the last page with empty rows.
            const numEmptyRows =
                newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - seeds.length) : 0;

            const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows;
            setPaddingHeight(newPaddingHeight);
        },
        [order, orderBy, dense, rowsPerPage],
    );

    const handleChangeRowsPerPage = React.useCallback(
        (event) => {
            const updatedRowsPerPage = parseInt(event.target.value, 10);
            setRowsPerPage(updatedRowsPerPage);

            setPage(0);

            const sortedRows = stableSort(seeds, getComparator(order, orderBy));
            const updatedRows = sortedRows.slice(
                0 * updatedRowsPerPage,
                0 * updatedRowsPerPage + updatedRowsPerPage,
            );

            setVisibleRows(updatedRows);

            // There is no layout jump to handle on the first page.
            setPaddingHeight(0);
        },
        [order, orderBy],
    );

    const isSelected = (name) => selected.indexOf(name) !== -1;
    const [plottingWizardInfo, setPlottingWizardInfo] = React.useState(false)

    return (
        <Box sx={{ width: '100%' }}>
            <Box>
                <SeedWizardDisplay sqFeetStr={sqFeetStr} setSqFeetStr={setSqFeetStr} setSeedData={setPlottingWizardInfo} seedData={plottingWizardInfo} />
            </Box>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar sqFtStr={sqFeetStr} setSqFtStr={setSqFeetStr} plottingWizardInfo={plottingWizardInfo} setPlottingWizardInfo={setPlottingWizardInfo}  selected={selected} numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={seeds.length}
                        />
                        <TableBody>
                            {visibleRows
                                ? visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.category}
                                            </TableCell>
                                            <TableCell align="right">{row.subcategory}</TableCell>
                                            <TableCell align="right">{row.name}</TableCell>
                                            <TableCell align="right">{row.status}</TableCell>
                                            <TableCell align="right">{row.daysToHarvest}</TableCell>
                                            <TableCell align="right">{row.minDaysToGerm}</TableCell>
                                            <TableCell align="right">{row.maxDaysToGerm}</TableCell>
                                            <TableCell align="right">{row.earliestPlantDate}</TableCell>
                                            <TableCell align="right">{row.latestPlantDate}</TableCell>
                                            <TableCell align="right">{row.spacingInchesX}</TableCell>
                                            <TableCell align="right">{row.spacingInchesY}</TableCell>
                                            <TableCell align="right"><p style={{fontSize:'8px'}}>{row.id}</p> </TableCell>
                                        </TableRow>
                                    );
                                })
                                : null}
                            {paddingHeight > 0 && (
                                <TableRow
                                    style={{
                                        height: paddingHeight,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[50, 100, 150]}
                    component="div"
                    count={seeds.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}