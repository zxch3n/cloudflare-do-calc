const DAU = 100_000;
const DAILY_DURATION_IN_HOURS = 2;
const WEBSOCKET_CONNECT_TIME_PER_HOUR_PER_USER = 2;
const MESSAGE_COUNT_PER_HOUR_PER_USER = 60;
const AVG_MESSAGE_PROCESS_TIME_IN_S = 0.020;

function calculateHibernationWithStorageCost() {
    console.log("Calculate Hibernation With Storage Cost");
    const requestNumberMonthly = calculateRequestNumberMonthly();
    const requestPrice = calcRequestPrice(requestNumberMonthly);
    const computeDurationSeconds =
        calculateComputeDurationForHibernationPerMonth();
    const computePrice = calcComputePrice(computeDurationSeconds);
    const storagePrice = calcStoragePrice();
    console.log(
        `requestPrice: ${requestPrice}, computePrice: ${computePrice}, storagePrice: ${storagePrice}`,
    );
    console.log(`total: ${requestPrice + computePrice + storagePrice}`);
}

function calculateCostWithoutHibernation() {
    console.log("Calculate Cost Without Hibernation");
    const requestNumberMonthly = calculateRequestNumberMonthly();
    const requestPrice = calcRequestPrice(requestNumberMonthly);
    const computeDurationSeconds =
        calculateComputeDurationWithoutHibernationPerMonth();
    const computePrice = calcComputePrice(computeDurationSeconds);
    console.log(`requestPrice: ${requestPrice}, computePrice: ${computePrice}`);
    console.log(`total: ${requestPrice + computePrice}`);
}

function calcRequestPrice(requestNumberMonthly: number) {
    return Math.max(requestNumberMonthly - 1e6, 0) * 0.15 / 1e6;
}

function calcComputePrice(computeDurationSeconds: number) {
    const gSeconds = computeDurationSeconds * 128 / 1000;
    return Math.max(gSeconds - 400_000, 0) * 12.5 / 1e6;
}

function calculateRequestNumberMonthly() {
    const connectionNumberPerDay = DAU *
        WEBSOCKET_CONNECT_TIME_PER_HOUR_PER_USER *
        DAILY_DURATION_IN_HOURS;
    const connectionNumberPerMonth = connectionNumberPerDay * 30;
    const messageNumberPerDay = DAU *
        MESSAGE_COUNT_PER_HOUR_PER_USER *
        DAILY_DURATION_IN_HOURS;
    const messageNumberPerMonth = messageNumberPerDay * 30;
    return connectionNumberPerMonth + messageNumberPerMonth / 20;
}

function calculateComputeDurationWithoutHibernationPerMonth() {
    const durationSeconds = DAU *
        DAILY_DURATION_IN_HOURS *
        3600 * 30;
    return durationSeconds;
}

function calculateComputeDurationForHibernationPerMonth() {
    const durationSeconds = DAU *
        MESSAGE_COUNT_PER_HOUR_PER_USER *
        DAILY_DURATION_IN_HOURS *
        AVG_MESSAGE_PROCESS_TIME_IN_S * 30;
    return durationSeconds;
}

function calcStoragePrice() {
    const AVG_READ_PER_MESSAGE = 2;
    const AVG_WRITE_PER_MESSAGE = 2;
    const AVG_DELETE_PER_MESSAGE = 0.1;
    const readNum = DAU *
        AVG_READ_PER_MESSAGE * DAILY_DURATION_IN_HOURS *
        MESSAGE_COUNT_PER_HOUR_PER_USER * 30;
    const writeNum = DAU *
        AVG_WRITE_PER_MESSAGE * DAILY_DURATION_IN_HOURS *
        MESSAGE_COUNT_PER_HOUR_PER_USER * 30;
    const deleteNum = DAU *
        AVG_DELETE_PER_MESSAGE * DAILY_DURATION_IN_HOURS *
        MESSAGE_COUNT_PER_HOUR_PER_USER * 30;
    const readPrice = Math.max(readNum - 1e6, 0) * 0.2 / 1e6;
    const writePrice = Math.max(writeNum - 1e6, 0) * 1 / 1e6;
    const deletePrice = Math.max(deleteNum - 1e6, 0) * 1 / 1e6;
    return readPrice + writePrice + deletePrice;
}

calculateHibernationWithStorageCost();
console.log("");
calculateCostWithoutHibernation();
