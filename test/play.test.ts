import { expect } from "chai";
// import * as ERROR_MSGS from "../src/constants/error_msgs";
// import { interfaces } from "../src/interfaces/interfaces";
import { Container, inject, injectable } from "../src/inversify";
// import * as METADATA_KEYS from "../src/constants/metadata_keys";

describe("InversifyJS", () => {
  it("Should be able to resolve and inject dependencies", () => {
    interface INinja {
      fight(): string;
      sneak(): string;
    }

    interface IKatana {
      hit(): string;
    }

    interface IShuriken {
      throw(): string;
    }

    @injectable()
    class Katana implements IKatana {
      public name: string = "Katana";
      public hit() {
        return "cut!";
      }
    }

    @injectable()
    class Shuriken implements IShuriken {
      public name: string = "Shuriken";
      public throw() {
        return "hit!";
      }
    }

    @injectable()
    class Ninja implements INinja {
      public name: string = "Ninja";
      private _katana: Katana;
      private _shuriken: Shuriken;

      public constructor(
        @inject("katana_key") katana: Katana,
        @inject("shuriken_key") shuriken: Shuriken
      ) {
        this._katana = katana;
        this._shuriken = shuriken;
      }

      public fight() {
        return this._katana.hit();
      }
      public sneak() {
        return this._shuriken.throw();
      }
    }

    const container = new Container();
    container.bind<INinja>("ninja_key").to(Ninja);
    container.bind<IKatana>("katana_key").to(Katana);
    container.bind<IShuriken>("shuriken_key").to(Shuriken);

    const ninja = container.get<INinja>("ninja_key");

    // const types = Reflect.getMetadata(METADATA_KEYS.DESIGN_PARAM_TYPES, Ninja);
    // const paramsMetadata = Reflect.getMetadata(METADATA_KEYS.TAGGED, Ninja);
    // console.log("types", types);
    // console.log("paramsMetadata", paramsMetadata);

    expect(ninja.fight()).eql("cut!");
    expect(ninja.sneak()).eql("hit!");
  });
});
