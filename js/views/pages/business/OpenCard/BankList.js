"use strict";
import ScreenComponent from "./../../../components/ScreenComponent";
import animation from 'js-core-animation';

class BankList extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "选择开户行"
    };
  }
  componentWillUnmount(){
    if(this._scrollAnimation){
        this._scrollAnimation.finish();
    }
  }
  scrollTo(sectionName) {
    let section = this.refs['section-' + sectionName];
    let wrapper = document.querySelector('.classification');
    let search = document.querySelector('.search-bank-box');
    if(section&&wrapper){
        let s = section.offsetTop-wrapper.scrollTop;
        let src=wrapper.scrollTop;
        if(this._scrollAnimation){
            this._scrollAnimation.finish();
        }
        this._scrollAnimation=animation.ease({
            duration:Math.abs(s/40),
            onProgress:function(progress){
                wrapper.scrollTop=s*progress+src-search.offsetHeight;
            }
        });
        this._scrollAnimation.start();
    }
  }
  _renderBankList(bankSource) {
    let alphabet = this.props.alphabet;
    return (
        alphabet.map((code, i) => {
            let items = bankSource[code];
            if (!items || items.length == 0) {
                return null;
            }
            return (
                <dl
                    ref={'section-' + code}
                    key={code}>
                    <dt>{code}</dt>
                    <dd>
                        <ul>
                            {this._renderSection(items)}
                        </ul>
                    </dd>
                </dl>
            );
        })
    )
  }
  _renderSection(items) {
    return items.map((item, i) => {
        return (
            <li
                onClick={() => this.props.onClick("bank", item)}
                key={i}>
                {item.code_name}
            </li>
        );
    });
  }
  render() {
    let bankSource = this.props.bankSource;
    if(!bankSource) return null;
    return (
      <div
        className="bd-bank-list">
            {this._renderBankList(bankSource)}
      </div>
    );
  }
}

export default BankList;