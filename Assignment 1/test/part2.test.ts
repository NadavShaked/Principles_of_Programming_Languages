import { expect } from "chai";
import { composeMany } from "../src/part2/part2";
import { partition } from "../src/part2/part2";
import { mapMat } from "../src/part2/part2";
import { maxSpeed } from "../src/part2/part2";
import { grassTypes } from "../src/part2/part2";
import { uniqueTypes } from "../src/part2/part2";

describe("composeMany", () => {
    it("composes many functions",()=>{
        let wf=composeMany([(x: number) => x*x, (x: number) => x + 1, (x: number) => 2*x]);
        expect(wf(4)).to.equal(81);
    })
    it("composes many functions",()=>{
        let wf=composeMany([(x: number) => x*x, (x: number) => x*2, (x: number) => x+1]);
        expect(wf(4)).to.equal(100);
    })
});

describe("partirion", ()=>{
  it("seperate even and odd numbers", ()=> {
      const numbers =[1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(partition(x => x % 2 === 0, numbers)).to.deep.equal([[2, 4, 6, 8], [1, 3, 5, 7, 9]]);
  })
})

describe("mapMat", () => {
    it("apply map for matrix",()=>{
    let mat:number[][] = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]; 
        expect(mapMat((x: number) => x * x, mat)).to.deep.equal([[ 1, 4, 9 ], [ 16, 25, 36 ], [ 49, 64, 81 ]]);
    })
       
});

const pokedax1 =[{
    "id": 1,
    "name": {
      "english": "Bulbasaur",
      "japanese": "フシギダネ",
      "chinese": "妙蛙种子",
      "french": "Bulbizarre"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 45,
      "Attack": 49,
      "Defense": 49,
      "Sp. Attack": 65,
      "Sp. Defense": 65,
      "Speed": 45
    }
  },
  {
    "id": 2,
    "name": {
      "english": "Ivysaur",
      "japanese": "フシギソウ",
      "chinese": "妙蛙草",
      "french": "Herbizarre"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 60,
      "Attack": 62,
      "Defense": 63,
      "Sp. Attack": 80,
      "Sp. Defense": 80,
      "Speed": 60
    }
  },
  {
    "id": 3,
    "name": {
      "english": "Venusaur",
      "japanese": "フシギバナ",
      "chinese": "妙蛙花",
      "french": "Florizarre"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 80,
      "Attack": 82,
      "Defense": 83,
      "Sp. Attack": 100,
      "Sp. Defense": 100,
      "Speed": 80
    }
  },
  {
    "id": 4,
    "name": {
      "english": "Charmander",
      "japanese": "ヒトカゲ",
      "chinese": "小火龙",
      "french": "Salamèche"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 39,
      "Attack": 52,
      "Defense": 43,
      "Sp. Attack": 60,
      "Sp. Defense": 50,
      "Speed": 65
    }
  },
  {
    "id": 5,
    "name": {
      "english": "Charmeleon",
      "japanese": "リザード",
      "chinese": "火恐龙",
      "french": "Reptincel"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 58,
      "Attack": 64,
      "Defense": 58,
      "Sp. Attack": 80,
      "Sp. Defense": 65,
      "Speed": 80
    }
  },
  {
    "id": 6,
    "name": {
      "english": "Charizard",
      "japanese": "リザードン",
      "chinese": "喷火龙",
      "french": "Dracaufeu"
    },
    "type": [
      "Fire",
      "Flying"
    ],
    "base": {
      "HP": 78,
      "Attack": 84,
      "Defense": 78,
      "Sp. Attack": 109,
      "Sp. Defense": 85,
      "Speed": 100
    }
  },
  {
    "id": 7,
    "name": {
      "english": "Squirtle",
      "japanese": "ゼニガメ",
      "chinese": "杰尼龟",
      "french": "Carapuce"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 44,
      "Attack": 48,
      "Defense": 65,
      "Sp. Attack": 50,
      "Sp. Defense": 64,
      "Speed": 43
    }
  },
  {
    "id": 8,
    "name": {
      "english": "Wartortle",
      "japanese": "カメール",
      "chinese": "卡咪龟",
      "french": "Carabaffe"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 59,
      "Attack": 63,
      "Defense": 80,
      "Sp. Attack": 65,
      "Sp. Defense": 80,
      "Speed": 58
    }
  },
  {
    "id": 9,
    "name": {
      "english": "Blastoise",
      "japanese": "カメックス",
      "chinese": "水箭龟",
      "french": "Tortank"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 79,
      "Attack": 83,
      "Defense": 100,
      "Sp. Attack": 85,
      "Sp. Defense": 105,
      "Speed": 78
    }
  },
  {
    "id": 10,
    "name": {
      "english": "Caterpie",
      "japanese": "キャタピー",
      "chinese": "绿毛虫",
      "french": "Chenipan"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 45,
      "Attack": 30,
      "Defense": 35,
      "Sp. Attack": 20,
      "Sp. Defense": 20,
      "Speed": 45
    }
  },
  {
    "id": 11,
    "name": {
      "english": "Metapod",
      "japanese": "トランセル",
      "chinese": "铁甲蛹",
      "french": "Chrysacier"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 50,
      "Attack": 20,
      "Defense": 55,
      "Sp. Attack": 25,
      "Sp. Defense": 25,
      "Speed": 30
    }
  },
  {
    "id": 12,
    "name": {
      "english": "Butterfree",
      "japanese": "バタフリー",
      "chinese": "巴大蝶",
      "french": "Papilusion"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 60,
      "Attack": 45,
      "Defense": 50,
      "Sp. Attack": 90,
      "Sp. Defense": 80,
      "Speed": 70
    }
  },
  {
    "id": 13,
    "name": {
      "english": "Weedle",
      "japanese": "ビードル",
      "chinese": "独角虫",
      "french": "Aspicot"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 40,
      "Attack": 35,
      "Defense": 30,
      "Sp. Attack": 20,
      "Sp. Defense": 20,
      "Speed": 50
    }
  },
  {
    "id": 14,
    "name": {
      "english": "Kakuna",
      "japanese": "コクーン",
      "chinese": "铁壳蛹",
      "french": "Coconfort"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 45,
      "Attack": 25,
      "Defense": 50,
      "Sp. Attack": 25,
      "Sp. Defense": 25,
      "Speed": 35
    }
  },
  {
    "id": 15,
    "name": {
      "english": "Beedrill",
      "japanese": "スピアー",
      "chinese": "大针蜂",
      "french": "Dardargnan"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 65,
      "Attack": 90,
      "Defense": 40,
      "Sp. Attack": 45,
      "Sp. Defense": 80,
      "Speed": 75
    }
  },{
    "id": 22,
    "name": {
      "english": "Fearow",
      "japanese": "オニドリル",
      "chinese": "大嘴雀",
      "french": "Rapasdepic"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 65,
      "Attack": 90,
      "Defense": 65,
      "Sp. Attack": 61,
      "Sp. Defense": 61,
      "Speed": 100
    }
  },{
    "id": 44,
    "name": {
      "english": "Gloom",
      "japanese": "クサイハナ",
      "chinese": "臭臭花",
      "french": "Ortide"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 60,
      "Attack": 65,
      "Defense": 70,
      "Sp. Attack": 85,
      "Sp. Defense": 75,
      "Speed": 40
    }
  }];
  describe("maxspeed", () => {
    it("return all pokemon with the max speed",()=>{
       expect(maxSpeed(pokedax1)).to.deep.equal([{
        "id": 6,
        "name": {
          "english": "Charizard",
          "japanese": "リザードン",
          "chinese": "喷火龙",
          "french": "Dracaufeu"
        },
        "type": [
          "Fire",
          "Flying"
        ],
        "base": {
          "HP": 78,
          "Attack": 84,
          "Defense": 78,
          "Sp. Attack": 109,
          "Sp. Defense": 85,
          "Speed": 100
        }
      },{
        "id": 22,
        "name": {
          "english": "Fearow",
          "japanese": "オニドリル",
          "chinese": "大嘴雀",
          "french": "Rapasdepic"
        },
        "type": [
          "Normal",
          "Flying"
        ],
        "base": {
          "HP": 65,
          "Attack": 90,
          "Defense": 65,
          "Sp. Attack": 61,
          "Sp. Defense": 61,
          "Speed": 100
        }
      }]);
    })
       
});
describe("grasstypes", () => {
    it("return all pokemon with type grass sorted alphbeticly",()=>{
        expect(grassTypes(pokedax1)).to.deep.equal(["Bulbasaur","Gloom","Ivysaur","Venusaur"]
        );
       
})
});
describe("uniqueTypes", () => {
    it("return all unique types sorted alphbeticly",()=>{
        expect(uniqueTypes(pokedax1)).to.deep.equal(["Bug","Fire","Flying","Grass","Normal","Poison","Water"]
        );
})});