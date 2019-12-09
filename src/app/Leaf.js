import {LitElement, html, css} from 'lit-element';
import {mainStyle} from "../style";

const STATUS = {
    NONE: 1,
    CHECKED: 2,
    INDETERMINATE: 3,
};


export class Leaf extends LitElement{

    static get styles() {
        return [
            mainStyle,
            css`
                .node {
                    position: relative;
                    height: 50px;
                    width: 0;
                    cursor: pointer;
                }
            
                .item  {
                    position: absolute;
                    display: flex;
                    margin-left: 25px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                
                .item p {
                    margin: 0;
                }
                
                .arrow {
                    position: absolute;
                    width: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                
                .down {
                    transform: rotateZ(90deg);
                }
                
                .checkbox {
                    position: relative;
                    padding-left: 40px;
                }
                
                .checkbox input {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }
                
                .custom-checkbox{
                    position: absolute;
                    left: 8px;
                    height: 25px;
                    width: 25px;
                    background-color: #eee;
                    top: -15%;
                }
                
                .mark{
                    position: absolute;
                    top: 50%;
                    left: 8px;
                    height: 25px;
                    width: 25px;
                    transform: translate(0,-50%);
                }               
                
                .checkbox:hover input ~ .checkmark {
                    background-color: #ccc;
                }
                
                .checkbox input:checked ~ .checkmark {
                    background-color: #2196F3;
                }
                
                .checkmark:after {
                    content: "";
                    position: absolute;
                    display: none;
                }

                .checkbox input:checked ~ .checkmark:after {
                    display: block;
                }
                
                .checkbox .checkmark:after {
                    left: 9px;
                    top: 5px;
                    width: 5px;
                    height: 10px;
                    border: solid white;
                    border-width: 0 3px 3px 0;
                    -webkit-transform: rotate(45deg);
                    -ms-transform: rotate(45deg);
                    transform: rotate(45deg);
                }              
                
                .checkbox .indeterminate ~ .indeterminate-mark:after {
                    display: block;
                }
                
                .checkbox .indeterminate ~ .checkmark {
                    background-color: #2196F3;
                }
                
                .indeterminate-mark:after {
                    content: "";
                    position: absolute;
                    display: none;
                }
                
                .checkbox .indeterminate-mark:after {
                    left: 9px;
                    top: 5px;
                    width: 5px;
                    height: 10px;
                    border: solid white;
                    border-width: 0 3px 0 0;
                    -webkit-transform: rotate(90deg);
                    -ms-transform: rotate(90deg);
                    transform: rotate(90deg);
                }
                
                .hide {
                    display:none;
                }
                
                .underline {
                    text-decoration: underline;
                }
            `
        ];
    }

    static get properties() {
        return {
            leaf: { type: Object },
            childrenRef: { type: Array },
            hide: {type:Boolean},
            status: {type: Number},
        };
    }

    constructor(parentRef){
        super();
        this.parentRef = parentRef;
        this.childrenRef = [];
    }

    firstUpdated(_changedProperties) {
        this.leafChanged();
    }

    updated(_changedProperties) {
        if(_changedProperties.has('leaf')){
            this.leafChanged();
        }
    }

    render() {
        return html`
            ${this.leaf && this.leaf.included ? html`
                ${
                    this.parentRef && this.leaf.name ? html`
                        <div class="node">
                            ${  
                                this.hasChildren() ? html`
                                    <div class="arrow">
                                        <img class="${!this.hide ? 'down' : ''}" @click="${this.fold}" src="./src/assets/arrow.svg" />
                                    </div>       
                                ` : html``
                            }
                                                    
                            <div class="item" @click="${this.clicked}">
                                <div class="checkbox">
                                    <input type="checkbox" class="${this.status === STATUS.INDETERMINATE ? 'indeterminate':''}" .checked=${this.status === STATUS.CHECKED} .indeterminate=${this.status === STATUS.INDETERMINATE}>
                                    <span class="custom-checkbox"></span>
                                    <span class="mark checkmark"></span>
                                    <span class="mark indeterminate-mark"></span>
                                </div>
                                <p>${this.leaf.name}</p>
                            </div>
                        </div>
                    `: ''
                }
                <div class="${this.hide ? 'hide': ''}">
                    ${this.hasChildren() ? this.renderChildren() : ''}
                </div>
            `: ''}
        `
    }

    leafChanged(){
        if(this.leaf.children)
            this.childrenRef = this.leaf.children.map(leafData => {
                const leaf = new Leaf(this);
                leaf.leaf = leafData;
                return leaf;
            });
    }

    renderChildren(){
        return html`
            <ul>
                ${this.childrenRef.map(leaf => html`
                    ${leaf}
                `)}
            </ul>
        `
    }

    hasChildren(){
        return !!this.childrenRef.length;
    }

    fold(){
        this.hide = !this.hide;
        this.touch();
        this.callChildren(this.touch);
    }

    touch(){
        if(this.status !== STATUS.CHECKED){
            const hasCheckedChildren = this.hasCheckedInBranch();
            if(this.hide){
                if(hasCheckedChildren){
                    this.status = STATUS.INDETERMINATE
                }else{
                    this.status = STATUS.NONE;
                }
            }else{
                if(hasCheckedChildren){
                    this.status = STATUS.NONE;
                }
            }
        }
    }

    hasCheckedInBranch() {
        for (let childRef of this.childrenRef){
            const flag = childRef.isChecked() || childRef.hasCheckedInBranch();
            if(flag) return true;
        }
        return false;
    }

    isChecked(){
        return this.status === STATUS.CHECKED;
    }

    clicked(){
        if(this.status === STATUS.CHECKED){
            this.status = STATUS.NONE;
        }else if(this.status === STATUS.NONE || STATUS.INDETERMINATE){
            this.status = STATUS.CHECKED;
            this.openBranch();
        }

        this.determineStateDown();
        this.determineStateUp(this.status);
    }

    openBranch(){
        this.hide = false;
        this.callChildren(this.openBranch);
    }

    closeBranch(){
        this.hide = true;
        this.callChildren(this.closeBranch);
    }

    callChildren(method){
        for (let childRef of this.childrenRef){
            childRef[method.name]();
        }
    }

    determineStateDown(){
        switch (this.status) {
            case STATUS.NONE:
                this.callChildren(this.setNone);
                break;
            case STATUS.CHECKED:
                this.callChildren(this.setChecked);
                break;
        }
    }

    determineStateUp(newState){
        if(this.parentRef) {
            if(newState === STATUS.NONE)
                this.parentRef.status = STATUS.NONE;

            // this.parentRef.touch();
            this.parentRef.determineStateUp(newState)
        }
    }

    getChildrenRef(){
        return this.childrenRef;
    }

    setChecked(){
        this.status =STATUS.CHECKED;
        this.callChildren(this.setChecked);
    }

    setNone(){
        this.status =STATUS.NONE;
        this.callChildren(this.setNone);
    }
}

customElements.define('custom-leaf', Leaf);