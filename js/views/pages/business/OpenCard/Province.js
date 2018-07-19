"use strict";
import ScreenComponent from "./../../../components/ScreenComponent";
import index from "../../../components/Toast/index";

class Province extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "选择开户行"
    };
  }
  render() {
    return (
      <ul style={{paddingLeft: '.75rem', paddingRight: '0'}}>
        {this.props.dataSource.map((item, index) => {
          return (
            <li
              key={index}
              onClick={() => this.props.onClick("province", item)}
            >
              {item.all_name} <i />
            </li>
          );
        })}
      </ul>
    );
  }
}

export default Province;
