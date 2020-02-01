function win_logic(score, id) {
  console.log("id", id);
  if (score >= 100) {
    console.log("Winner");
    return "winner";
  }
}

export default win_logic;
