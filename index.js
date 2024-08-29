const { setupBot } = require("./bot");

function setup() {
  try {
    return setupBot().launch();
  } catch (error) {
    console.log(error);
  }
  setup();
}
setup();
