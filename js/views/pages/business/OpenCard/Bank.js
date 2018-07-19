"use strict";
import ScreenComponent from "./../../../components/ScreenComponent";
import api from "./../../../../controllers/api";
import Search from "./Search";
import Nav from "./Nav";
import BankList from "./BankList";
import SearchResult from "./SearchResult";

class Bank extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "选择开户行"
    };
    this.state = {
      navIndex: '',
      bankSource: {},
      alphabet: [],
      isShowMask: false,
      searchResultList: [],
      searchName: '',
      isShowSearchList: true
    }
    this.isScroll = false;
    this._onScroll = this._onScroll.bind(this);
  }
  componentDidMount() {
    let wrapper = document.querySelector('.classification');
    wrapper&&wrapper.addEventListener("scroll",this._onScroll,false);
  }
  componentWillReceiveProps(nextProps) {
    let bankSource = nextProps.dataSource;
    if(bankSource&&Object.keys(bankSource)&&Object.keys(bankSource).length>0) {
      this.setState({
        bankSource,
        alphabet: Object.keys(bankSource)
      })
    }
  }

  _onNavItemClick=(sectionName)=>{
    this.isScroll = true;
    this.setState({navIndex:sectionName});
    this.listContainer&&this.listContainer.scrollTo(sectionName);
    this.isScroll = false;
  }

  _onScroll(e){
    let wrapper = document.querySelector('.classification');
    let search = document.querySelector('.search-bank-box');
    let scrollTop=wrapper.scrollTop+search.offsetHeight;
    if(!this.isScroll){
        let alp = [].concat(this.state.alphabet);
        for(let item of alp.reverse()){
            let section = this.listContainer.refs['section-' + item];
            if(section){
                let offsetTop = section.offsetTop;
                if(scrollTop >= offsetTop){
                    this.setState({navIndex:item});
                    break;
                }else if(item === "A" && scrollTop < offsetTop){
                    this.setState({navIndex:''});
                    break;
                }
            }
        }
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
      province_id: selectedData[0].code,
      city_id: selectedData[1].code,
      name
    }
    if(name) {
      api.searchBankType(params).success((conent) => {
        this.setState({
          searchResultList: conent.data
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
  render() {
    if(Object.keys(this.state.bankSource)&&Object.keys(this.state.bankSource).length>0){
      return (
        <div className="choose-open-bank">
          <div className="search-bank-box">
            <Search
              ref={v => this.SEARCH = v}
              placeholder= {'搜索银行'}
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
                sign={'bank'}
              />
            }
          </div>
          {
            this.state.isShowMask&&<div className="mask" style={{zIndex: 2}}></div>
          }
          <BankList
            onClick={(type, item) => this.props.onClick(type, item)}
            alphabet={this.state.alphabet}
            ref={v=>this.listContainer=v}
            bankSource={this.state.bankSource} 
          />
          <Nav
            alphabet={this.state.alphabet}
            onItemClick={this._onNavItemClick} 
            navIndex={this.state.navIndex}
          />
        </div>
      );
    }else {
      return null;
    }
  }
}

export default Bank;