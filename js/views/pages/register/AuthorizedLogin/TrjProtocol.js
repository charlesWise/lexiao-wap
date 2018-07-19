'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

export default class TrjProtocol extends ScreenComponent {
    static pageConfig = {
        path: '/register/trjprotocol'
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '投融家注册协议'
        }
    }
    
    render() {
        return (
            <div className="trj-protocol-content">
                <div className="protocol-content">
                    <h4>
                    重要提示：
                    在使用投融家平台前，请注册用户务必充分阅读并理解《投融家注册协议》（以下简称“本协议”）的所有条款。特别是免除或者限制责任的条款、争议解决和法律适用条款。如注册用户对协议有任何疑问的，应向投融家客服咨询。
                    当注册用户按照注册页面提示填写信息、阅读并同意本协议且勾选注册页面下方的“我已阅读并同意《投融家注册协议》”选项等全部注册程序后，即表示注册用户已充分阅读、理解并接受本协议的全部内容，并与投融家平台达成协议。注册用户承诺接受并遵守本协议的约定，并不得以未阅读本协议的内容或者未获得投融家对注册用户问询的解答等理由，主张本协议无效，或要求撤销本协议。
                    </h4>
                    <p>一、协议范围</p>
                    <p>1、本协议由注册用户与杭州投融谱华互联网金融服务有限公司共同缔结，本协议具有合同效力。
                    投融家平台包括投融家电脑终端平台(网址为https://www.tourongjia.com)、移动终端（包括但不限于手机、笔记本、平板电脑）平台及第三方合作渠道平台（以下简称“投融家“）。</p>
                    <p>2、除另有明确声明外，投融家平台服务包含任何投融家及其关联公司提供的基于互联网以及移动网的相关服务，且均受本协议约束。如果注册用户不同意本协议的约定，注册用户应立即停止注册/激活程序或停止使用投融家平台服务。</p>
                    <p>3、本协议内容包括协议正文、法律声明、平台规则及所有投融家已经发布或将来可能发布的各类规则、公告或通知（以下合称“平台规则”或“规则”）。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。</p>
                    <p>4、投融家有权根据需要不时地制订、修改本协议及/或各类规则，并以平台公示的方式进行变更公告，无需另行单独通知注册用户。变更后的协议和规则一经在平台公布后，立即或在公告明确的特定时间自动生效。若注册用户在前述变更公告后继续使用投融家平台服务的，即表示注册用户已经阅读、理解并接受经修订的协议和规则。若注册用户不同意相关变更，应当立即停止使用投融家平台服务。</p>
                    <p>二、注册与账户</p>
                    <p>1、主体资格</p>
                    <p>注册用户确认，在注册用户完成注册程序或以其他投融家允许的方式实际使用投融家平台服务时，注册用户应当是具备完全民事权利能力和完全民事行为能力的自然人、法人或其他组织。若注册用户不具备前述主体资格，则注册用户及注册用户的监护人应承担因此而导致的一切后果，且投融家有权注销或永久冻结注册用户的账户，并要求注册用户及注册用户的监护人承担相应损失。</p>
                    <p>2、注册和账户</p>
                    <p>2.1当注册用户按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，或在注册用户按照激活页面提示填写信息、阅读并同意本协议且完成全部激活程序后，或注册用户以其他投融家允许的方式实际使用投融家平台服务时，注册用户即受本协议约束。注册用户可以使用其提供或确认的邮箱、手机号码或者投融家允许的其它方式作为登录手段进入投融家平台。</p>
                    <p>2.2注册用户可以对账户设置投融家用户名，注册用户也可以通过该投融家用户名登录投融家平台。注册用户设置的投融家用户名不得侵犯他人合法权益。如注册用户设置的投融家用户名涉嫌侵犯他人合法权益，投融家有权终止向其提供投融家平台服务，注销注册用户的投融家用户名。投融家用户名被注销后将开放给任意其他用户注册。</p>
                    <p>2.3投融家注册用户的用户名和密码不得以任何方式买卖、转让、赠与或继承，除非有法律明确规定或司法裁定，并经投融家同意，且需提供投融家要求的合格的文件材料并根据投融家制定的操作流程办理。</p>
                    <p>3、用户信息</p>
                    <p>3.1在注册或激活时，注册用户应当依照法律法规要求，按相应页面的提示准确提供准确、真实、完整的资料，并于资料信息变更时及时更新，以保证所提交资料的真实、及时、完整和准确。如有合理理由怀疑注册用户提供的资料错误、不实、过时或不完整的，投融家有权向注册用户发出询问及/或要求改正的通知，并有权直接做出删除相应资料的处理，直至中止、终止对注册用户提供部分或全部投融家平台服务。投融家对此不承担任何责任，注册用户将承担因此产生的任何直接或间接损失。</p>
                    <p>3.2注册用户应当准确填写并及时更新其提供的电子邮件地址、联系电话、联系地址、邮政编码等联系方式，以便投融家或其他用户与注册用户进行有效联系，因通过这些联系方式无法与注册用户取得联系，导致注册用户在使用投融家平台服务过程中产生任何损失或增加费用的，应由注册用户完全独自承担。注册用户了解并同意，注册用户有义务保持其提供的联系方式的真实性和有效性，如有变更或需要更新的，注册用户应按投融家的要求进行操作。</p>
                    <p>4、账户安全</p>
                    <p>4.1注册用户须自行负责对其用户名和密码保密，且须对任何利用该用户名和密码下所进行的所有言论及行为（包括但不限于信息披露、发布信息、网上点击同意或提交各类规则协议、网上续签协议或购买服务等）承担责任。注册用户同意：</p>
                    <p>（1）如发现任何人未经授权使用注册用户的用户名和密码，或发生违反保密规定的任何其他情况，注册用户会立即通知投融家；</p>
                    <p>（2）确保在每个上网时段结束时，注册用户以正确步骤离开平台/服务。投融家不能也不会对因注册用户未能遵守本款规定而发生的任何损失负责。注册用户理解投融家对注册用户的请求采取行动需要合理时间，投融家对在采取行动前已经产生的后果（包括但不限于注册用户的任何损失）不承担任何责任。</p>
                    <p>4.2注册用户了解并同意，确保注册用户账户及密码的机密安全是注册用户的责任。注册用户将对利用该注册用户账户及密码所进行的一切行为及言论负完全的责任，并同意以下事项：</p>
                    <p>（1）注册用户不对其他任何人泄露账户或密码，亦不可使用其他任何人的账户或密码。因黑客、病毒或注册用户的保管疏忽等非投融家方面的责任导致注册用户的注册用户账户遭他人非法使用的，投融家不承担任何责任。</p>
                    <p>（2）投融家通过注册用户的账户及密码来识别注册用户的指令，注册用户确认，使用注册用户账户和密码登陆后在投融家的一切行为均代表注册用户本人的真实意愿。注册用户账户操作所产生的电子信息记录均为注册用户行为的有效凭据，并由注册用户本人承担由此产生的全部责任。</p>
                    <p>（3）盗用他人账户及密码的，投融家及其合法授权主体保留追究实际使用人责任的权利。</p>
                    <p>（4）注册用户应根据投融家的相关规则以及投融家平台的相关提示创建一个安全密码。</p>
                    <p>5、登录名注销</p>
                    <p>注册用户同意并授权平台，注册用户如在投融家平台有欺诈、发布虚假信息、侵犯他人合法权益或其他违反法律法规、平台规则等行为，平台对此有权披露，注册用户的用户名可能被注销，所有平台服务同时终止。</p>
                    <p>注册用户决定不再使用注册用户账户时，应首先清偿所有应付款项（包括但不限于借款本金、利息、罚息、违约金、服务费、管理费等），再将账户中的可用款项（如有）全部提现或者向投融家发出其它合法的支付指令，并向投融家申请注销该注册用户账户，经投融家审核同意后可正式注销平台账户。 </p>   
                    <p>注册用户死亡或被宣告死亡的，其在本协议项下的各项权利义务由其继承人继承。若注册用户丧失全部或部分民事行为能力，投融家或其授权的主体有权根据有效法律文书（包括但不限于生效的法院判决等）或其法定监护人的指示处置与注册用户账户相关的款项。</p>
                    <p>注册用户同意，平台账户的暂停、中断或终止不代表注册用户责任的终止，注册用户仍应对使用投融家服务期间的行为承担可能的违约或损害赔偿责任，投融家仍可保有注册用户的相关信息。</p>
                    <p>三、本平台的服务内容</p>
                    <p>1、本平台为注册用户提供交易信息发布、交易管理服务、客户服务、合同管理等多方面服务。具体详情以投融家平台当时提供的服务内容为准。投融家服务的部分内容需要注册用户根据投融家要求完成身份认证及银行卡认证，未进行身份认证及/或银行卡认证的注册用户将无法使用该部分投融家服务。因未能完成认证而无法享受投融家服务造成的损失，投融家不承担任何责任。</p>
                    <p>2、投融家将为注册用户提供信息发布服务。投融家向注册用户提供的各种信息及资料仅为参考，注册用户应依其独立判断做出决策。注册用户据此进行交易的，产生的风险由注册用户自行承担，注册用户无权据此向投融家提出任何法律主张。在交易过程中，注册用户之间发生的纠纷，由纠纷各方自行解决，投融家不承担任何责任。</p>
                    <p>3、投融家平台向注册用户提供以下交易管理服务：</p>
                    <p>3.1注册用户在投融家平台进行注册时将生成注册用户账户，注册用户账户将记载注册用户在投融家平台的活动，上述注册用户账户是注册用户登陆投融家平台的唯一账户。</p>
                    <p>3.2注册用户在投融家平台上按投融家服务流程所确认的交易状态，将成为投融家为注册用户进行相关交易或操作（包括但不限于支付或收取款项、冻结资金、订立合同等）的不可撤销的指令。注册用户同意相关指令的执行时间以投融家系统实际操作的时间为准。注册用户同意投融家有权依据本协议及/或投融家相关纠纷处理规则等约定对相关事项进行处理。注册用户未能及时对交易状态进行修改、确认或未能提交相关申请所引起的任何纠纷或损失由注册用户自行负责，投融家不承担任何责任。</p>
                    <p>3.3投融家不提供“即时”金额转账服务，投融家对资金到账延迟不承担任何责任。</p>
                    <p>3.4投融家向符合条件的注册用户提供服务，但是不保证注册用户在发出借款要约或投资意向后，能够实际获得借款或投资成功。注册用户因前述原因导致的损失（包括但不限于利息、手续费等损失）由注册用户自行承担，投融家不承担责任。</p>
                    <p>3.5注册用户通过投融家平台进行各项交易或接受交易款项时，若注册用户未遵从本协议条款或投融家公布的交易规则中的操作指示，投融家不承担任何责任。若发生上述状况而款项已先行拨入注册用户账户下，注册用户同意投融家有权直接从相关注册用户账户中扣回款项及禁止注册用户要求支付此笔款项之权利。此款项若已汇入注册用户的银行账户，注册用户同意投融家有向注册用户事后索回的权利，由此产生的追索费用由注册用户承担。</p>
                    <p>3.6投融家有权基于交易安全及合法合规等方面的考虑不时设定涉及交易的相关事项，包括但不限于交易限额、交易次数等，注册用户了解投融家的前述设定可能会对交易造成一定不便，对此没有异议。</p>
                    <p>3.7如果投融家发现了因系统故障或其他任何原因导致的处理错误，无论有利于投融家还是有利于注册用户，投融家都有权纠正该错误。如果该错误导致注册用户实际收到的款项多于应获得的金额，则无论错误的性质和原因为何，投融家保留纠正不当执行交易的权利，注册用户应根据投融家向注册用户发出的有关纠正错误的通知的具体要求返还多收的款项或进行其他操作。注册用户理解并同意，注册用户因前述处理错误而多付或少付的款项均不计利息，投融家不承担因前述处理错误而导致的任何损失或责任（包括注册用户可能因前述错误导致的利息、汇率等损失）。</p>
                    <p>4、投融家将为注册用户提供以下客户服务：</p>
                    <p>4.1银行卡认证：为使用投融家或投融家委托的第三方机构提供的充值、取现、代扣等服务，注册用户应按照投融家平台规定的流程提交以注册用户本人名义登记的有效银行借记卡等信息，经由投融家审核通过后，投融家会将注册用户的账户与前述银行账户进行绑定。如注册用户未按照投融家规定提交相关信息或提交的信息错误、虚假、过时或不完整，或者投融家有合理的理由怀疑注册用户提交的信息为错误、虚假、过时或不完整，投融家有权拒绝为注册用户提供银行卡认证服务，注册用户因此未能使用充值、取现、代扣等服务而产生的损失自行承担。</p>
                    <p>4.2充值：注册用户可以使用投融家指定的方式向用户平台账户充入资金，用于通过投融家平台进行交易。</p>
                    <p>4.3代收/代付：投融家按照其平台当时向注册用户开放的功能提供代收/代付服务，自行或委托第三方机构代为收取其他用户或投融家合作的担保公司等第三方向注册用户的账户支付的本息、代偿金等各类款项，或者将注册用户账户里的款项支付给注册用户指定的其他方。</p>
                    <p>4.4取现：注册用户可以通过投融家平台当时开放的取现功能将注册用户账户中的资金转入经过认证的银行卡账户中。投融家将于收到注册用户的前述指示后，尽快通过第三方机构将相应的款项汇入注册用户经过认证的银行卡账户（根据注册用户提供的银行不同，会产生汇入时间上的差异）。</p>
                    <p>4.5查询：投融家将对注册用户在投融家平台的所有操作进行记录，不论该操作之目的最终是否实现。注册用户可以通过注册用户账户实时查询注册用户账户名下的交易记录。注册用户理解并同意注册用户最终收到款项的服务是由注册用户经过认证的银行卡对应的银行提供的，需向该银行请求查证。注册用户理解并同意通过投融家平台查询的任何信息仅作为参考，不作为相关操作或交易的证据或依据；如该等信息与投融家记录存在任何不一致，应以投融家提供的书面记录为准。</p>
                    <p>注册用户了解，上述充值、代收/代付及取现服务涉及投融家与银行、担保公司、第三方支付机构等第三方的合作。注册用户同意：</p>
                    <p>（1）受银行、担保公司、第三方支付机构等第三方仅在工作日进行资金代扣及划转的现状等各种原因所限，投融家不对前述服务的资金到账时间做任何承诺，也不承担与此相关的责任，包括但不限于由此产生的利息、货币贬值等损失；</p>
                    <p>（2）注册用户一经使用前述服务，即表示其不可撤销地授权投融家进行相关操作，且该等操作是不可逆转的，注册用户不能以任何理由拒绝付款或要求取消交易。就前述服务，注册用户应按照第三方的规定向第三方支付费用，具体请见第三方平台的相关信息。与第三方之间就费用支付事项产生的争议或纠纷，与投融家无关。</p>
                    <p>4.6注册用户每次使用投融家服务应直接登录投融家网站或使用投融家提供的链接登陆投融家网站（网址：https://www.tourongjia.com，如投融家以公告等形式发布新的网址，请届时登录新的网址），而不要通过邮件或其他平台提供的链接登录。注册用户每次拨打投融家客服电话应拨打投融家官方平台提供的客服电话，而不要拨打其他任何电话。</p>
                    <p>4.7注册用户同意，投融家有权在提供投融家服务过程中以各种方式投放各种商业性广告或其他任何类型的商业信息（包括但不限于在投融家平台的任何页面上投放广告）。同时，注册用户同意接受投融家通过电子邮件或其他方式向注册用户发送商品促销或其他相关商业信息，并有权选择取消相关信息。</p>
                    <p>5、投融家将为注册用户提供以下合同管理服务：</p>
                    <p>5.1在投融家平台交易需订立的合同采用电子合同方式。注册用户使用注册用户账户登录投融家平台后，根据投融家的相关规则，以注册用户账户ID在投融家平台通过点击确认或类似方式签署的电子合同即视为注册用户本人真实意愿并以注册用户本人名义签署的合同，具有法律效力。注册用户应妥善保管自己的账户密码等账户信息，注册用户通过前述方式订立的电子合同对合同各方具有法律约束力，注册用户不得以其账户密码等账户信息被盗用或其他理由否认已订立的合同的效力或不按照该等合同履行相关义务。</p>
                    <p>5.2注册用户根据本协议以及投融家的相关规则签署电子合同后，不得擅自修改该合同。投融家向注册用户提供电子合同的备案、查看、核对服务，如对电子合同真伪或电子合同的内容有任何疑问，注册用户可通过使用投融家的合同查阅功能进行核对。如对此有任何争议，应以投融家记录的合同为准。</p>
                    <p>5.3注册用户不得私自仿制、伪造在投融家平台上签订的电子合同或印章，不得用伪造的合同进行招摇撞骗或进行其他非法行为，否则由注册用户自行承担责任。</p>
                    <p>6、投融家将以上服务全部或部分委托由第三方提供的，无需事前取得注册用户的同意，本协议内容继续有效。</p>
                    <p>7、除外责任</p>
                    <p>7.1在任何情况下，对于注册用户使用投融家服务过程中涉及由第三方提供相关服务的责任由该第三方承担，投融家不承担该等责任。投融家不承担责任的情形包括但不限于：</p>
                    <p>（1）因银行、第三方支付机构等第三方未按照注册用户和/或投融家指令进行操作引起的任何损失或责任；</p>
                    <p>（2）因银行、第三方支付机构等第三方原因导致资金未能及时到账或未能到账引起的任何损失或责任；</p>
                    <p>（3）因银行、第三方支付机构等第三方对交易限额或次数等方面的限制而引起的任何损失或责任；</p>
                    <p>（4）因其他第三方的行为或原因导致的任何损失或责任。</p>
                    <p>7.2因注册用户自身的原因导致的任何损失或责任，由注册用户自行负责，投融家不承担责任。投融家不承担责任的情形包括但不限于：</p>
                    <p>（1）注册用户未按照本协议或投融家平台公布的任何规则进行操作导致的任何损失或责任；</p>
                    <p>（2）因注册用户使用的银行卡的原因导致的损失或责任，包括注册用户使用未经认证的银行卡或使用非注册用户本人的银行卡或使用信用卡，注册用户的银行卡被冻结、挂失等导致的任何损失或责任；</p>
                    <p>（3）注册用户向投融家发送的指令信息不明确、或存在歧义、不完整等导致的任何损失或责任；</p>
                    <p> （4）注册用户账户内余额不足导致的任何损失或责任；</p>
                    <p>（5）其他因注册用户原因导致的任何损失或责任。</p>
                    <p>四、风险提示</p>
                    <p>1、注册用户了解并认可，任何通过投融家进行的交易并不能避免以下风险的产生，投融家不能也没有义务为如下风险负责：</p>
                    <p>（1）宏观经济风险：因宏观经济形势变化，可能引起价格等方面的异常波动，注册用户有可能遭受损失；</p>
                    <p>（2）政策风险：有关法律、法规及相关政策、规则发生变化，可能引起价格等方面异常波动，注册用户有可能遭受损失；</p>
                    <p>（3）违约风险：因其他交易方无力或无意愿按时足额履约，注册用户有可能遭受损失；</p>
                    <p>（4）利率风险：市场利率变化可能对购买或持有产品的实际收益产生影响；</p>
                    <p>（5）不可抗力因素导致的风险；</p>
                    <p>（6）因注册用户的过错导致的任何损失，该过错包括但不限于：决策失误、操作不当、遗忘或泄露密码、密码被他人破解、注册用户使用的计算机系统被第三方侵入、注册用户委托他人代理交易时他人恶意或不当操作而造成的损失。</p>
                    <p>（7）若第三方担保公司发生被依法撤销、破产或发生其它导致无法履行代偿责任的情况，则担保公司将无法继续履行代偿责任，由此而导致注册用户的一切损失投融家平台不承担任何责任。</p>
                    <p>2、投融家不对任何注册用户及/或任何交易提供任何明示或默示的担保或条件。投融家不能也不试图对注册用户发布的与交易有关的信息进行控制，对该等信息，投融家不承担任何形式的证明、鉴定服务。投融家对第三方提供信息仅做形式审查，第三方提供虚假信息，投融家无需承担任何由此引起的法律责任。注册用户依赖于注册用户的独立判断进行交易，注册用户应对其作出的判断承担全部责任。</p>
                    <p>3、以上并不能揭示注册用户通过投融家进行交易的全部风险及市场的全部情形。注册用户在做出交易决策前，应全面了解相关交易，谨慎决策，并自行承担全部风险。</p>
                    <p>五、服务费用</p>
                    <p>1、当注册用户使用投融家服务时，投融家会向注册用户收取相关服务费用。各项服务费用详见注册用户使用投融家服务时投融家平台上所列收费方式说明。投融家保留单方面制定及调整服务费用的权利。</p>
                    <p>2、注册用户在使用投融家服务过程中（如充值或取现等）可能需要向第三方（如银行或第三方支付公司等）支付一定的费用，具体收费标准详见第三方网站相关页面，或投融家平台的提示。</p>
                    <p>六、注册用户的守法义务及承诺</p>
                    <p>1、注册用户承诺绝不为任何非法目的或以任何非法方式使用投融家服务，并承诺遵守中国相关法律、法规及一切使用互联网之国际惯例，遵守所有与投融家服务有关的网络协议、规则和程序。</p>
                    <p>2、注册用户保证并承诺通过投融家平台进行交易的资金来源合法。</p>
                    <p>3、注册用户同意并保证不得利用投融家服务从事侵害他人权益或违法之行为，若有违反者应负所有法律责任。上述行为包括但不限于：</p>
                    <p>（1）反对宪法所确定的基本原则，危害国家安全、泄漏国家秘密、颠覆国家政权、破坏国家统一的。</p>
                    <p>（2）侵害他人名誉、隐私权、商业秘密、商标权、著作权、专利权、其他知识产权及其他权益。</p>
                    <p>（3）违反依法律或合约所应负之保密义务。</p>
                    <p>（4）冒用他人名义使用投融家服务。</p>
                    <p>（5）从事任何不法交易行为，如贩卖枪支、毒品、禁药、盗版软件或其他违禁物。</p>
                    <p>（6）提供赌博资讯或以任何方式引诱他人参与赌博。</p>
                    <p>（7）涉嫌洗钱、套现或进行传销活动的。</p>
                    <p>（8）从事任何可能含有电脑病毒或是可能侵害投融家服务系統、资料等行为。</p>
                    <p>（9）利用投融家服务系统进行可能对互联网或移动网正常运转造成不利影响之行为。</p>
                    <p>（10）侵犯投融家的商业利益，包括但不限于发布非经投融家许可的商业广告。</p>
                    <p>（11）利用投融家服务上传、展示或传播虚假的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、庸俗淫秽的或其他任何非法的信息资料。</p>
                    <p>（12）其他投融家有正当理由认为不适当之行为。</p>
                    <p>4、投融家保有依其单独判断删除投融家平台内各类不符合法律政策或不真实或不适当的信息内容而无须通知注册用户的权利，并无需承担任何责任。若注册用户未遵守以上规定的，投融家有权作出独立判断并采取暂停或关闭注册用户账户等措施，而无需承担任何责任。</p>
                    <p>5、注册用户同意，由于注册用户违反本协议，或违反通过援引并入本协议并成为本协议一部分的文件，或由于注册用户使用投融家服务违反了任何法律或第三方的权利而造成任何第三方进行或发起的任何补偿申请或要求（包括律师费用），注册用户会对投融家及其关联方、合作伙伴、董事以及雇员给予全额补偿并使之不受损害。</p>
                    <p>6、注册用户承诺，其通过投融家平台上传或发布的信息均真实有效，其向投融家提交的任何资料均真实、有效、完整、详细、准确。如因违背上述承诺，造成投融家或投融家其他使用方损失的，注册用户将承担相应责任。</p>
                    <p>七、服务中断或故障</p>
                    <p>注册用户同意，基于互联网的特殊性，投融家不担保服务不会中断。系统因相关状况无法正常运作，使注册用户无法使用任何投融家服务或使用任何投融家服务时受到任何影响时，投融家对注册用户或第三方不负任何责任，前述状况包括但不限于：</p>
                    <p>（1）投融家系统停机维护期间。</p>
                    <p>（2）电信设备出现故障不能进行数据传输的。</p>
                    <p>（3）由于黑客攻击、网络供应商技术调整或故障、网站升级、银行方面的问题等原因而造成的投融家服务中断或延迟。</p>
                    <p>（4）因台风、地震、海啸、洪水、停电、战争、恐怖袭击等不可抗力之因素，造成投融家系统障碍不能执行业务的。</p>
                    <p>八、责任范围及限制</p>
                    <p>1、投融家未对任何投融家服务提供任何形式的保证，包括但不限于以下事项：</p>
                    <p>（1）投融家服务将符合注册用户的需求。</p>
                    <p>（2）投融家服务将不受干扰、及时提供或免于出错。</p>
                    <p>（3）注册用户经由投融家服务购买或取得之任何产品、服务、资讯或其他资料将符合注册用户的期望。</p>
                    <p>2、投融家的合作单位所提供的服务品质及内容由该合作单位自行负责。投融家平台的内容可能涉及由第三方所有、控制或者运营的其他网站（以下简称“第三方网站”），投融家不能保证也没有义务保证第三方网站上任何信息的真实性和有效性。注册用户确认按照第三方网站的服务协议使用第三方网站，而不是按照本协议。第三方网站不是投融家推荐或者介绍的，第三方网站的内容、产品、广告和其他任何信息均由注册用户自行判断并承担风险，而与投融家无关。注册用户经由投融家服务的使用下载或取得任何资料，应由注册用户自行考量且自负风险，因资料的下载而导致的任何损失由注册用户自行承担。</p>
                    <p>3、注册用户自投融家及投融家工作人员或经由投融家服务取得的建议或资讯，无论其为书面或口头，均不构成投融家对投融家服务的任何保证。</p>
                    <p>4、投融家不保证为向注册用户提供便利而设置的外部链接的准确性、有效性、安全性和完整性，但保证不提供钓鱼网站、病毒网站。同时，对于该等外部链接指向的不由投融家实际控制的任何网页上的内容，投融家不承担任何责任。</p>
                    <p>5、在法律允许的情况下，投融家对于与本协议有关或由本协议引起的，或者由于使用投融家平台、或由于其所包含的或以其它方式通过投融家平台提供给注册用户的全部信息、内容、材料、产品（包括软件）和服务、或购买和使用产品引起的任何间接的、惩罚性的、特殊的、派生的损失（包括但不限于业务损失、收益损失、利润损失、使用数据或其他经济利益的损失），不论是如何产生的，也不论是由对本协议的违约（包括违反保证）还是由侵权造成的，均不负有任何责任，即使其事先已被告知此等损失的可能性。另外，即使本协议规定的排他性救济没有达到其基本目的，也应排除投融家对上述损失的责任。</p>
                    <p>6、除本协议另有规定外，在任何情况下，投融家对本协议所承担的违约赔偿责任总额不超过向注册用户收取的当次投融家服务费用总额。</p>
                    <p>九、隐私权保护及授权条款</p>
                    <p>1、投融家对于注册用户提供的、投融家自行收集的、经认证的个人信息将按照本协议予以保护、使用或者披露。投融家无需注册用户同意即可向第三方授权主体转让与投融家平台有关的全部或部分权利和义务。未经投融家事先书面同意，注册用户不得转让其在本协议项下的任何权利和义务。</p>
                    <p>2、投融家可能自公开及私人资料来源处收集注册用户的额外资料，以更好地掌握注册用户情况，并为注册用户度身订造投融家服务、解决争议并有助确保在投融家平台进行安全交易。</p>
                    <p>3、投融家按照注册用户在投融家平台上的行为自动追踪关于注册用户的某些资料。在不透露注册用户的隐私资料的前提下，投融家有权对整个注册用户数据库进行分析并对注册用户数据库进行商业上的利用。</p>
                    <p>4、注册用户同意投融家可使用关于注册用户的相关资料（包括但不限于投融家持有的有关注册用户的档案中的资料，投融家从注册用户目前及以前在投融家平台上的活动所获取的其他资料以及投融家通过其他方式自行收集的资料）以解决争议、对纠纷进行调停。注册用户同意投融家可通过人工或自动程序对注册用户的资料进行评价。</p>
                    <p>5、投融家采用行业标准惯例以保护注册用户的资料。注册用户因履行本协议提供给投融家的信息，投融家不会恶意出售或免费共享给任何第三方，以下情况除外：</p>
                    <p>（1）提供独立服务且仅要求服务相关的必要信息的供应商，如印刷厂、邮递公司等；</p>
                    <p>（2）具有合法调阅信息权限并从合法渠道调阅信息的政府部门或其他机构，如公安机关、法院；</p>
                    <p>（3）投融家的关联实体；</p>
                    <p>（4）经平台使用方或平台使用方授权代表同意的第三方。</p>
                    <p>6、注册用户提供给投融家信息可用于投融家及因服务必要而委托的第三方为注册用户提供服务及推荐产品，法律禁止的除外。投融家及其委托的第三方对上述信息负有保密义务。</p>
                    <p>7、投融家有义务根据有关法律要求向司法机关和政府部门提供注册用户的个人资料。在注册用户未能按照与投融家签订的服务协议或者与投融家其他注册用户签订的协议等其他法律文本的约定履行自己应尽的义务时，投融家有权根据自己的判断，或者与该笔交易有关的其他注册用户的请求披露注册用户的个人信息和资料，并做出评论。注册用户严重违反投融家的相关规则的，投融家有权对注册用户提供的及投融家自行收集的注册用户的个人信息和资料编辑入网站黑名单，并将该黑名单对第三方披露，且投融家有权将注册用户提交或投融家自行收集的注册用户的个人资料和信息与任何第三方进行数据共享，以便平台和第三方催收逾期借款及对注册用户的其他申请进行审核之用，由此可能造成的注册用户的任何损失，投融家不承担法律责任。</p>
                    <p>十、税务处理</p>
                    <p>注册用户在享有投融家平台提供的服务时产生的一切相关税费，由注册用户向其主管税务机关申报、缴纳，投融家不负责处理相关事宜。</p>
                    <p>十一、知识产权的保护</p>
                    <p>投融家平台上所有内容，包括但不限于著作、图片、档案、资讯、资料、平台架构、平台画面的安排、网页设计，均由投融家或其他权利人依法拥有其知识产权，包括但不限于商标权、专利权、著作权、商业秘密等。</p>
                    <p>非经投融家或其他权利人书面同意，任何人不得擅自使用、修改、复制、公开传播、改变、散布、发行或公开发表投融家平台程序或内容。</p>
                    <p>十二、条款的解释、法律适用及争端解决</p>
                    <p>本协议是由注册用户与投融家共同签订的，适用于注册用户在投融家的全部活动。本协议内容包括但不限于协议正文条款及已经发布的或将来可能发布的各类规则，所有条款和规则为协议不可分割的一部分，与协议正文具有同等法律效力。</p>
                    <p>本协议不涉及注册用户与投融家的其他注册用户之间，因网上交易而产生的法律关系及法律纠纷。但注册用户在此同意将全面接受并履行与投融家其他注册用户在投融家签订的任何电子法律文本，并承诺按照该法律文本享有和（或）放弃相应的权利、承担和（或）豁免相应的义务。</p>
                    <p>本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，则应认为该条款可与本协议相分割，并可被尽可能接近各方意图的、能够保留本协议要求的经济目的的、有效的新条款所取代，而且，在此情况下，本协议的其他条款仍然完全有效并具有约束力。</p>
                    <p>本协议及其修订的有效性、履行与本协议及其修订效力有关的所有事宜，将受中国法律管辖，任何争议仅适用中国法律。</p>
                    <p>本协议签订地为中国杭州市。因本协议所引起的注册用户与投融家的任何纠纷或争议，首先应友好协商解决，协商不成的，注册用户在此完全同意将纠纷或争议提交投融家所在地有管辖权的人民法院诉讼解决。</p>
                    <p>投融家对本服务协议拥有最终的解释权。</p>
                </div>
            </div>
        );
    }
}