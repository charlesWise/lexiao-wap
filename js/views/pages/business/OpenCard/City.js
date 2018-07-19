"use strict";
import ScreenComponent from "./../../../components/ScreenComponent";

class City extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "选择开户行"
    };
  }
  render() {
    return (
      <ul>
        {this.props.dataSource.map((item, index) => {
          return (
            <li key={index} onClick={() => this.props.onClick("city", item)}>
              {item.name} 
              {/*<i />*/}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default City;
