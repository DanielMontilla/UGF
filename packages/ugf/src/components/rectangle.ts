import Component from "./component";
import { Color, Position } from "../types";

export default class Rectangle extends Component {
  public constructor(
    public position: Position,
    public color: Color
  ) { super(); }
}