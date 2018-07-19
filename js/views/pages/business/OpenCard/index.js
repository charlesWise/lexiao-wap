"use strict";
import ScreenComponent from "./../../../components/ScreenComponent";
import api from "./../../../../controllers/api";
import Province from "./Province";
import City from "./City";
import Bank from "./Bank";
import Branch from "./Branch";

class OpenCard extends ScreenComponent {
  static pageConfig = {
    path: "/business/opencard",
    permission: true
  };
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "选择开户行"
    };
    this.state = {
      showList: [true, false, false, false],
      provinceList: [],
      cityList: [],
      areaList: [],
      bankList: [],
      branchList: [],
      selectedData: [{}, {}, {}, {}]
    };
  }

  componentDidMount() {
    this._fetchData("province");
  }
  
  _fetchData(type, data) {
    let key = "getArea";
    if (type === "bank") {
      key = "getBankType";
    } else if (type === "branch") {
      key = "getSubBank";
    }
    api[key](data).success((content, next, abort) => {
      if (content.boolen == 1) {
        if (type === "province") {
          this.setState({ provinceList: content.data });
        } else if (type === "city") {
          this.setState({ cityList: content.data });
        } else if (type === "area") {
          this.setState({ areaList: content.data });
        } else if (type === "bank") {
          this.setState({ bankList: content.data.list });
        } else if (type === "branch") {
          this.setState({ branchList: content.data.list });
        }
      } else {
        this.getScreen().toast(content.message, 3000);
      }
    });
  }

  _onClick(type, data) {
    let showList = [false, false, false, false];
    let selectedData = this.state.selectedData;
    if (type === "province") {
      showList[1] = true;
      selectedData[0] = data;
      this._fetchData("city", { area_code: data.code });
    } else if (type === "city") {
      showList[2] = true;
      selectedData[1] = data;
      this._fetchData("bank", {
        province_id: this.state.selectedData[0].code,
        city_id: this.state.selectedData[1].code
      });
    } else if (type === "bank") {
      showList[3] = true;
      selectedData[2] = data;
      this._fetchData("branch", {
        code_no: data.bank_no,
        province_id: this.state.selectedData[0].code,
        city_id: this.state.selectedData[1].code,
        name: data.code_name
      });
    } else if (type === "branch") {
      selectedData[3] = data;
      this.props.navigation.state.params &&
        this.props.navigation.state.params.callback({
          open_card: selectedData
        });
      this.props.navigation.goBack();
    }
    this.setState({ showList, selectedData });
  }
  render() {
      return (
        <div className="classification">
          {this.state.showList[0] && (
            <Province
              dataSource={this.state.provinceList || []}
              onClick={(type, data) => this._onClick(type, data)}
            />
          )}
          {this.state.showList[1] && (
            <City
              dataSource={this.state.cityList || []}
              onClick={(type, data) => this._onClick(type, data)}
            />
          )}
          {this.state.showList[2] && (
            <Bank
              dataSource={this.state.bankList || []}
              selectedData={this.state.selectedData}
              onClick={(type, data) => this._onClick(type, data)}
            />
          )}
          {this.state.showList[3] && (
            <Branch
              dataSource={this.state.branchList || []}
              selectedData={this.state.selectedData}
              onClick={(type, data) => this._onClick(type, data)}
            />
          )}
        </div> 
      );
  } 
}

export default OpenCard;
