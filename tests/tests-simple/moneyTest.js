import { formatcurrency } from "../../scritps/utils/money.js";

console.log("test suit: format currency");

if(formatcurrency(2095) === '20.95') {
    console.log("passed");
}
else {
    console.log('failed');
}
if(formatcurrency(0) === '0.00') {
    console.log("passed");
}
else {
    console.log('failed');
}
if(formatcurrency(136789657024580) === '1367896570245.80') {
    console.log("passed");
}
else {
    console.log('failed');
}

if(formatcurrency(2000.5) === '20.01') {
    console.log("passed");
}
else {
    console.log('failed');
}