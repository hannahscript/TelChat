const ANSI_CSI = '\u001b[';
const ANSI_MOVE_CURSOR = (row, col) => `${ANSI_CSI}${row};${col}H`;
const ANSI_CLEAR_LINE_CURSOR_TO_END = `${ANSI_CSI}K`;
const ANSI_CLEAR_LINE_CURSOR_TO_START = `${ANSI_CSI}1K`;
const ANSI_CLEAR_LINE = `${ANSI_CSI}2K`;
const ANSI_STORE_CURSOR = `${ANSI_CSI}s`;
const ANSI_LOAD_CURSOR = `${ANSI_CSI}u`;

function moveCursor(row, col) {
    return ANSI_MOVE_CURSOR(row + 1, col + 1);
}

function storeCursor() {
    return ANSI_STORE_CURSOR;
}

function loadCursor() {
    return ANSI_LOAD_CURSOR;
}

function clearLine() {
    return ANSI_CLEAR_LINE;
}

function clearLineToStart() {
    return ANSI_CLEAR_LINE_CURSOR_TO_START;
}

function clearLineToEnd() {
    return ANSI_CLEAR_LINE_CURSOR_TO_END;
}

module.exports = {
    moveCursor,
    storeCursor,
    loadCursor,
    clearLine,
    clearLineToStart,
    clearLineToEnd
};