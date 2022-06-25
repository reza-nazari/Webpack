import Footer from "../../layout/Footer.html";
import Header from "../../layout/Header.html";
import "./index.scss";

document.getElementById("app-header").innerHTML! = Header;
document.getElementById("app-footer").innerHTML! = Footer;

enum TT {
  one = "This text load from ts file",
}
document.getElementById("load-in-ts").innerText = TT.one;