var vm = new Vue({
  el: "#app",
  data: {
    showControls: false,
    controls: {
      play: false,
      manual: true,
      stepping: true
    },
    settings: {
      displayed: {
        mazeRow: 10,
        mazeCol: 10,
        staticLength: true,
        startLength: 1,
        foodNumber: 2
      },
      saved: {}
    },
    mazeSettings: {
      unit: 25,
      gap: 1
    },
    foodLocations: [],
    snakeLocations: [], // head to tail
    logs: [
      "log test log test log test log test log test log test log test ",
      "log test",
      "log test",
      "log test",
      "log test",
    ],
    accPoints: 0,
    playerList: [{
      value: "",
      label: ""
    }],
    selectedPlayer: "",
  },
  computed: {
    settingsModified: function () {
      return JSON.stringify(this.settings.displayed) !== JSON.stringify(this.settings.saved);
    },
    mazePadLoc: function () {
      let locs = [];
      [...Array(this.settings.saved.mazeCol).keys()].forEach((cval,cidx,carr) => {
        [...Array(this.settings.saved.mazeRow).keys()].forEach((rval,ridx,rarr) => {
          locs.push([cval * this.mazeSettings.unit + Math.max(cval + 1, 0) * this.mazeSettings.gap, rval * this.mazeSettings.unit + Math.max(rval + 1, 0) * this.mazeSettings.gap]);
        });
      });
      return locs;
    },
    mazeViewBox: function () {
      return [
        0, 0, 
        this.settings.saved.mazeCol * this.mazeSettings.unit + Math.max(this.settings.saved.mazeCol + 1, 0) * this.mazeSettings.gap, 
        this.settings.saved.mazeRow * this.mazeSettings.unit + Math.max(this.settings.saved.mazeRow + 1, 0) * this.mazeSettings.gap
      ];
    }
  },
  components: {
    "button-with-label": {
      template: "#button-with-label",
      props: ["icon", "label"]
    },
    "button-only": {
      template: "#button-only",
      props: ["icon"]
    },
    "text-button": {
      template: "#text-button"
    },
  },
  mounted: function () {
    this.settings.saved = Object.assign({}, this.settings.saved, this.settings.displayed);
    this.setSnakeInitialLocations();
    [...Array(this.settings.saved.foodNumber).keys()].forEach(() => this.generateFoodLocation());
  },
  methods: {
    setSnakeInitialLocations: function () {
      this.snakeLocations.splice(0, this.snakeLocations.length);
      this.snakeLocations.push([0, Math.floor(this.settings.saved.mazeRow/2)]);
      let grow = "tail"; // "head" "tail"
      let growDir = "d"; // "u" "d" "l" "r"
      while (this.snakeLocations.length < Math.min(this.settings.saved.startLength, this.settings.saved.mazeRow * this.settings.saved.mazeCol - this.settings.saved.foodNumber)) {
        let loc = {
          head: this.snakeLocations[0],
          tail: this.snakeLocations[this.snakeLocations.length - 1]
        };
        let nextLoc = this.getNewLocByDir(loc[grow], growDir);
        // if nextloc is outside of maze
        while ( [-1, this.settings.saved.mazeCol].includes(nextLoc[0]) || [-1, this.settings.saved.mazeRow].includes(nextLoc[1]) ) {
          if ( [-1, this.settings.saved.mazeCol].includes(nextLoc[0]) ) { // if row is filled
            if (grow == "head") { growDir = "u"; }
            else { growDir = "d"; }
          }
          if ( nextLoc[1] == this.settings.saved.mazeRow ) { // if bottom all filled
            grow = "head";
            growDir = "r";
          }
          if ( nextLoc[1] == -1 ) { // if all is filled
            nextLoc = [loc[grow][0], loc[grow][1]];
          } else {
            nextLoc = this.getNewLocByDir(loc[grow], growDir);
          }
        }

        // add nextloc to head or tail
        if (grow == "head") { this.snakeLocations.splice(0, 0, nextLoc); }
        else { this.snakeLocations.push(nextLoc); }

        // identify next growing direction
        if ( ["d", "u"].includes(growDir) ) {
          if (nextLoc[0] == 0) { growDir = "r"; }
          else { growDir = "l"; }
        }
      }
    },
    getNewLocByDir: function (oldLoc, dir) {
      let allDir = ["u", "d", "l", "r"];
      let operations = [
        [0, -1],
        [0, +1],
        [-1, 0],
        [+1, 0]
      ];
      let operation = operations[allDir.indexOf(dir)];
      return [oldLoc[0] + operation[0], oldLoc[1] + operation[1]];
    },
    generateFoodLocation: function () {
      let occupied = this.foodLocations.concat(this.snakeLocations);
      let occupiedString = occupied.map(x => String(x));
      let locs = [];
      [...Array(this.settings.saved.mazeCol).keys()].forEach((cval,cidx,carr) => {
        [...Array(this.settings.saved.mazeRow).keys()].forEach((rval,ridx,rarr) => {
          if (!occupiedString.includes(String([cval, rval]))) {
            locs.push([cval, rval]);
          }
        });
      });
      this.foodLocations.push(locs[ Math.floor( Math.random() * locs.length ) ]);
    },
    getCoord: function (idx) {
      return this.mazeSettings.unit/2 + idx * this.mazeSettings.unit + Math.max(idx+1,0) * this.mazeSettings.gap;
    },
    reset: function () {
      console.log("resetting");
    },
    showtrees: function () {
      console.log("showing search trees");
    },
    saveSettings: function () { this.settings.saved = Object.assign({}, this.settings.saved, this.settings.displayed); },
    discardSettings: function () { this.settings.displayed = Object.assign({}, this.settings.displayed, this.settings.saved); },
    nextStep: function () {
      console.log("next step");
    }
  }
});