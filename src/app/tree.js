import {LitElement, html, css} from 'lit-element';
import './Leaf';

export class Tree extends LitElement{

    static get properties() {
        return {
            data: { type: Object },
        };
    }

    firstUpdated(_changedProperties) {
        this.rootNode = this.shadowRoot.querySelector('custom-leaf');

        console.log(this.rootNode);
    }

    render() {
        return html`
            <custom-leaf .leaf="${this.data}"></custom-leaf>
        `
    }

    search(search){
        const copyChildren = [...this.data.children];
        this.searchRecursive(copyChildren, search);
        this.data = {children:copyChildren, included: true};
    }

    closeTree(){
        console.log(this.rootNode);
        for(let node of this.rootNode.getChildrenRef()){
            node.closeBranch();
            node.touch();
        }
    }

    openTree(){
        for(let node of this.rootNode.getChildrenRef()){
            node.openBranch();
            node.touch();
        }
    }

    searchRecursive(children, s) {
        let found = false;
        if (children) {
            for (let child of children) {
                const searchFound = this.searchRecursive(child.children, s) || child.name.toLowerCase().includes(s.toLowerCase());
                child.included = searchFound;
                if (searchFound) {
                    found = true;
                }
            }
        }
        return found;
    }
}

customElements.define('custom-tree', Tree);
