"use strict";
import ScreenComponent from "./../../../components/ScreenComponent";

class List extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "子商户管理"
    };
  }
  render() {
    let statusText = "";
    return (
      <div className="submerchant-list">
        {this.props.dataSource.map((item, index) => {
          return (
            <div
              key={index}
              className="submerchant-item"
              onClick={e => this.props.onClick(e, "item_edit", item)}
            >
              <h3 className="name">
                {item.name} <span className="iphone">{item.mobile}</span>
                {["2", "4"].indexOf(item.status) != -1 && (
                  <em>{this.props.status[parseInt(item.status) - 1]}</em>
                )}
              </h3>
              <p className="props">
                <span>
                  累计邀请：<em>{item.invitations}</em>人
                </span>
                <span>
                  累计获利：<em>{item.profits}</em>元
                </span>
                {/*this.props.isAuth == 1 &&
                  item.status == "1" && (
                    <a
                      style={{ zIndex: 1 }}
                      onClick={e => this.props.onClick(e, "item_audit", item)}
                    >
                      审核
                    </a>
                  )*/}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default List;
