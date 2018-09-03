function Stuff(stuffB) {
  this.stuffA = 'some stuff';
  this.stuffB = stuffB;
  this.changeStuff = (finalstuff) => {
    console.log(this.stuffA);
    return new Promise((resolve) => {
      this.stuffA = finalstuff;
      resolve();
    });
  };
}

const stuffInstance = new Stuff('stuffb');

const promises = [];

for (i = 0; i < 5; i++) {
  promises.push(stuffInstance.changeStuff());
}

Promise.all(promises);
