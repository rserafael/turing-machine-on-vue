let block, test, arr;

window.onload = () => {
  console.log("logic has started");
  startLogic();
}
function random10Block(size = 5, hasHyphen = true, hasEmpty = true, emptySize = null) {
  let block = [];
  block.push({ id: "start", normal: true, focused: false, green: false, })
  for (let i = 0; i < size; i++) {
    let o, value;
    value = Math.round(Math.random());
    o = { id: value, normal: true, focused: false, green: false };
    block.push(o);
  }
  if (hasHyphen) {
    block.push({ id: "-", normal: true, focused: false, green: false });
  }
  if (hasEmpty) {
    if (emptySize === null) {
      emptySize = size;
    }
    for (let i = 0; i < emptySize; i++) {
      let o, value;
      value = null;
      o = { id: value, normal: true, focused: false, green: false };
      block.push(o);
    }
  }
  return block;
}
function startLogic() {
  arr = random10Block();
  block = new Vue(
    {
      el: '#block',
      data: {
        blocks: arr,
        ok: false,
        msg1: "Hello",
        msg2: "GoodBye",
        index: 0,
        saved: false,
        savedValue: null,
        time: 100,
        loggedIn: false,
        shiftLeft: false,
        copyMch: true,
        likeable: false,
        copyDone: false,
        shiftDone: false,
        copyRunning: false,
        shiftRunning: false,
        liked: false,
        message: "",
        txt: "Thank, You!",
        txtIndex: 0,
      },
      methods: {
        focusIt: function (block, callback) {
          for (var b in this.blocks) {
            if (block === this.blocks[b]) {
              this.blocks[b].focused = true;
              // window.alert(`index: ${this.index}\nid: ${this.blocks[this.index].id}\nb:${b}\nid2:${this.blocks[b].id}`);
            }
            else {
              this.blocks[b].focused = false;
            }
          }
          if (typeof callback === "function") {
            setTimeout(() => callback(), this.time);
          }
        },
        writeValue: function (value) {
          let text;
          if (value === undefined) {
            value = this.savedValue;
          }
          this.blocks[this.index].id = value;
          text = `value: ${value}, block.id = ${this.blocks[this.index].id}, index: ${this.index}`;
        },
        saveValue: function () {
          let text;
          this.savedValue = this.blocks[this.index].id;
          text = `Saved value: ${this.savedValue}`;
        },
        goRightTo: function (symbol, callback) {
          setTimeout(
            () => {
              if (this.index >= 0 && this.index < this.blocks.length) {
                let block = this.blocks[this.index];
                this.focusIt(block);
                if (block.id !== symbol) {
                  this.index++;
                  this.goRightTo(symbol, callback);
                }
                else {
                  if (typeof callback === "function") {
                    setTimeout(callback, this.time);
                  }
                }
              }
            },
            this.time
          );
        },
        goLeftTo: function (symbol, callback) {
          setTimeout(
            () => {
              if (this.index >= 0 && this.index < this.blocks.length) {
                let block = this.blocks[this.index];
                this.focusIt(block);
                if (block.id !== symbol) {
                  this.index--;
                  this.goLeftTo(symbol, callback);
                }
                else {
                  if (typeof callback === "function") {
                    setTimeout(callback, this.time);
                  }
                }
              }
            },
            this.time
          );
        },
        turing: function () {
          if (this.index === 0) {
            this.copyRunning = true;
            this.focusIt(
              this.blocks[this.index],
              () => {
                this.index++;
                this.focusIt(this.blocks[this.index], this.turing());
              });
          }
          else {
            this.saveValue();
            this.writeValue("x");
            this.goRightTo(
              null,
              () => {
                this.writeValue();
                this.goLeftTo(
                  "x",
                  () => {
                    this.writeValue();
                    this.index++;
                    let block = this.blocks[this.index];
                    if (block.id !== "-") {
                      this.goRightTo(
                        block.id,
                        () => {
                          setTimeout(() => this.turing(), this.time * 2);
                        });
                    }
                    else {
                      this.goLeftTo(
                        "start",
                        () => {
                          this.blocks[this.index].green = true;
                          this.copyRunning = false;
                          this.copyDone = true;
                        });
                    }
                  });
              });
          }
        },
        restart() {
          this.blocks = random10Block();
          this.index = 0;
          this.focusIt(null);
        },
        restartLeft() {
          this.blocks = random10Block(5, false, true, 1);
          this.index = 0;
          this.focusIt(null);
        },
        shiftLeftStart: function () {
          if (this.index === 0) {
            this.shiftRunning = true;
            this.focusIt(
              this.blocks[this.index],
              () => {
                this.index++;
                // window.alert(`add index: ${this.index}`);
                this.focusIt(this.blocks[this.index], this.shiftLeftStart);
              });
          }
          else {
            this.index++;
            this.focusIt(
              this.blocks[this.index],
              () => {
                // window.confirm(`index: ${this.index}, id: ${this.blocks[this.index].id}`);
                this.saveValue();
                if (this.blocks[this.index].id === null) {
                  console.log(`1`);
                  this.writeValue(null);
                  console.log(`2`);
                  this.goLeftTo(
                    'x',
                    () => {
                      this.writeValue(null);
                      console.log(`3`);
                      this.goLeftTo(
                        "start",
                        () => {
                          this.index = 0;
                          this.focusIt(
                            this.blocks[this.index],
                            () => {
                              this.blocks[this.index].green = true;
                              this.shiftRunning = false;
                              this.shiftDone = true;
                            });
                        });
                    }
                  );
                }
                else {
                  this.writeValue("x");
                  setTimeout(
                    () => {
                      this.index--;
                      this.focusIt(
                        this.blocks[this.index],
                        () => {
                          this.writeValue();
                          setTimeout(
                            () => {
                              this.goRightTo(
                                'x',
                                () => {
                                  this.shiftLeftStart();
                                });
                            },
                            this.time);
                        }
                      );
                    },
                    this.time);
                }

              });
          }
        },
        changeToCopyMch: function () {
          this.restartLike();
          if (this.copyMch === false) {
            this.copyMch = true;
            this.shiftLeft = false;
            this.restart();
          }
        },
        changeToShiftLeft: function () {
          this.restartLike();
          this.liked = false;
          if (this.shiftLeft === false) {
            this.copyMch = false;
            this.shiftLeft = true;
            this.restartLeft();
          }
        },
        changeToRate: function () {
          this.likeable = true;
        },
        likeIt: function (boolean) {
          this.liked = true;
          this.playMessage();
        },
        restartLike: function () {
          this.liked = false;
          this.likeable = false;
          this.message = "";
        },
        playMessage: function () {
          setTimeout(
            () => {
              this.message += this.txt[this.index++];
              if (this.index < this.txt.length) {
                this.playMessage();
              }
            },
            60
          );
        }
      }
    });

  login = new Vue(
    {
      el: "#login",
      data: {
        loggedIn: false,
      },
      methods: {
        submitEmail: function (event) {
          event.preventDefault();
          let form, email, name, formData, options;
          form = document.getElementById("infoForm");
          email = form[0].value;
          name = form[1].value;
          console.log(`email: ${email}, name: ${name}`);
          formData = new FormData(form);
          options = {
            method: "POST",
            headers: new Headers(),
            body: formData,
          }
          fetch( window.location.href.replace(window.location.pathname, "")  + "/verifyemail", options)
            .then((res) => {
              console.log(window.location.href);
              return res.json();
            })
            .then((json) => {
              if(json.isEmailValid && !json.isNameEmpty){
                this.loggedIn = true;
                block.loggedIn = true;
              }
              else{
                window.alert("email invalid or empty name");
              }
            })
            .catch((err) => {
              console.log(`erro: ${err}`);
              window.alert("There'd been an error.\nThough i'll let you go.");
              this.loggedIn = true;
              block.loggedIn = true;
            });
        }
      }
    }
  );
}
