import React, {useState} from "react";
import "./App.css";
// STEP 4 - import the button and display components
// Don't forget to import any extra css/scss files you build into the correct component
// Logo has already been provided for you. Do the same for the remaining components
import Logo from "./components/DisplayComponents/Logo";
import Display from "./components/DisplayComponents/Display";
import Numbers from "./components/ButtonComponents/NumberButtons/Numbers";
import Operators from "./components/ButtonComponents/OperatorButtons/Operators";
import Specials from "./components/ButtonComponents/SpecialButtons/Specials";

function App() {
  // STEP 5 - After you get the components displaying using the provided data file, write your state hooks here.
  // Once the state hooks are in place write some functions to hold data in state and update that data depending on what it needs to be doing
  // Your functions should accept a parameter of the the item data being displayed to the DOM (ie - should recieve 5 if the user clicks on
  // the "5" button, or the operator if they click one of those buttons) and then call your setter function to update state.
  // Don't forget to pass the functions (and any additional data needed) to the components as props
  let [display, setDisplayState] = useState("0") // Current Display on calculator
  let [isCalculated, setCalcState] = useState(true); // Checks for recent calculation/initializing, replacing the current display
  let [usedDecimal, setDecimalState] = useState(false); // Prevents from using 2 decimals in one number
  let [total, setTotalState] = useState({value:0, recent:0, lastOp:null}); // Keeps track of most recent operation clicked, the current total 
  // the calculation, and the most recent number entered before the operation.

  // Reset occurs when hitting equals or % sign. Reset means that the calculator will act like it was just opened for the first time
  // forgetting about the calculation it just did. Entering in a number after a reset will erase the current display
  function reset(){
    setCalcState(true);
    setDecimalState(false);
    setTotalState({value:0, recent:0, lastOp:null});
  }
  let operators = ["/", "*", "-","+","="];

  // Will calculate the number based off the most recent operation saved.
  // Calculate occurs when clicking a second or more operator. For example: 2+3+ will calculate the new total as 5.
  // Returns the recent value if the last operator is null, which means it is the first operator in the calculation.
  function calculate(){
    if (total.lastOp) {
      if (total.lastOp == "+") {
        return total.value + total.recent;
      } else if (total.lastOp == "-") {
        return total.value - total.recent;
      } else if (total.lastOp == "/") {
        return total.value / total.recent;
      } else {
        return total.value * total.recent;
      }
    } else {
      return Number(display);
    }
  }

  // Handling event for clicking the numbers buttons, 0-9 and .
  function numbersClick(event){
    if (display.toString().length < 15 || total.lastOp) {
      // Replaces current display with next button if the display is initialized/a calculation.
      if (isCalculated) {
        setCalcState(false);
        display = "";
      }
      // Clicking the decimal will prevent a second decimal click
      if (event.target.textContent  == "." && !usedDecimal) {
        setDecimalState(true);
        setDisplayState(display + event.target.textContent);
      // All numbers. Adds numbers to current display
      } else if (event.target.textContent != ".") {
        setDisplayState(display + event.target.textContent);
      }
    }
  }

  // Handler event for clicking an operation button
  function opClick (event) {
    total.recent = Number(display); // Most recent value is current display 
    total.value = calculate();
    total.lastOp = event.target.value;
    setDisplayState(total.value); // Shows current total value when chaining operators
    setCalcState(true); // Will replace display with next number clicked
    setDecimalState(false); // Allows for decimals again since we are starting a new number
    if (event.target.value == "=") {
      // Allows for reset, or can continue adding to current sum
      reset();
    }
  }
  // Handler event for clicking the special buttons
  function specialsClick(event){
    // Reset to 0
    if (event.target.textContent == "C") {
      reset();
      setDisplayState(0);
    // Switches current number to negative/positive
    } else if (event.target.textContent == "+/-") {
      if (display[0] == "-") {
        setDisplayState(display.substring(1));
      } else { 
        setDisplayState("-" + display);
      }
    // Turns current display into a decimal
    } else {
      setDisplayState(display/100);
      reset();
    }
  }
  return (
    <div className="container">
      <Logo />
      <Display display={display}/>
      <div className="App">
        {/* STEP 4 - Render your components here and be sure to properly import/export all files */}
        <div className="nums-specs">
          <Specials onClick= {
            (event) => {
              specialsClick(event);
            }
          }
          />
          <Numbers 
            onClick={
              (event)=>{
                numbersClick(event);
              }
            }
          />
        </div>
        <Operators
          onClick = {
            (event) => {
              opClick(event);
            }
          }
        />
      </div>
    </div>
  );
}

export default App;
