"use strict";
import ScreenComponent from "./../../../components/ScreenComponent";
import api from "./../../../../controllers/api";
import Search from "./Search";
import SearchResult from "./SearchResult";

class Branch extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "选择开户行"
    };
    this.state = {
      branchBankList: [],
      isShowMask: false,
      searchResultList: [],
      searchName: '',
      isShowSearchList: true
    }
  }
  componentWillReceiveProps(nextProps) {
    let branchBankList = nextProps.dataSource;
    if(branchBankList&&branchBankList.length>0) {
      this.setState({branchBankList})
    }
  }
  _onFocus = () => {
    this.SEARCH&&this.SEARCH.showCancel&&this.SEARCH.showCancel();
    this.setState({
      isShowMask: true,
      isShowSearchList: true
    })
  }
  _onCancel = () => {
    this.SEARCH&&this.SEARCH.hideCancel&&this.SEARCH.hideCancel();
    this.setState({
      isShowMask: false,
      isShowSearchList: false,
      searchResultList: []
    })
  }
  _onChange = (e) => {
    let searchName = e.target.value;
    if(searchName) {
      this.SEARCH&&this.SEARCH.showClear&&this.SEARCH.showClear();
    }else {
      this.SEARCH&&this.SEARCH.hideClear&&this.SEARCH.hideClear();
    }
    this.setState({searchName})
    this._searchBank(searchName);
  }
  _searchBank(name) {
    let selectedData = this.props.selectedData;
    let params = {
      code_no: selectedData[2].bank_no,
      province_id: selectedData[0].code,
      city_id: selectedData[1].code,
      name,
      type: 1 // 搜索子支行
    }
    if(name) {
      api.getSubBank(params).success((conent) => {
        this.setState({
          searchResultList: conent.data.list
        })
      }).error((conent) => {
          this.getScreen().toast(conent.message)
      })
    }else {
      this.setState({
        searchResultList: []
      })
    }
  }
  _renderBranchBank() {
    let branchBankList = this.state.branchBankList;
    if(branchBankList.length>0) {
      return (
        <div className="branch-bank-list">
          <ul>
            {
              branchBankList.map((item, i) => {
                return (
                  <li
                    key={i}
                    onClick={() => this.props.onClick("branch", item)}>
                    {item.bank_name}
                  </li>
                )
              })
            }
          </ul>
        </div>
      )
    }else {
      return null;
    }
  }
  render() {
    return (
      <div className="branch-bank-wrap">
        <div className="search-bank-box">
          <Search
            ref={v => this.SEARCH = v}
            placeholder= {'搜索分支行'}
            onChange={this._onChange}
            onCancel={this._onCancel}
            onFocus={this._onFocus}
            onClearSearch={() => this._searchBank('')}
          />
          {
            this.state.isShowSearchList&&<SearchResult 
              searchResultList={this.state.searchResultList}
              searchName={this.state.searchName}
              onClick={(type, item) => this.props.onClick(type, item)}
              sign={'branch'}
            />
          }
        </div>
        {
          this.state.isShowMask&&<div className="mask" style={{zIndex: 2}}></div>
        }
        {this._renderBranchBank()}
      </div>
    );
  }
}

export default Branch;