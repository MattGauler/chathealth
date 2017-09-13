// import 'skatejs-web-components'
// import { Component, h, prop } from 'skatejs'
class CTActionMenu extends HTMLElement {
    constructor(self) {
        self = super();
        return self;
    }
    connectedCallback() {
        this.menuVisible = false;
        if (!this.id) {
            this.id = 'ct-action-menu-' + Helper._safeId(Math.random().toString());
        }
        this._render();
    }
    _render() {
        if (this.label) {
            this._renderLabel();
        }
    }
    _renderLabel() {
        let icon = this._createMainIcon();
        let label = this._createMainLabel();
        let toggleButton = this._createToggleButton();
        let mainContainer = document.createElement('div');
        mainContainer.className = 'ct-action-menu-host';
        mainContainer.appendChild(icon);
        mainContainer.appendChild(label);
        mainContainer.appendChild(toggleButton);
        if (this.label.isDisabled) {
            mainContainer.setAttribute('disabled', 'disabled');
            mainContainer.classList.add('disabled');
        }
        this.appendChild(mainContainer);
    }
    _hideList() {
        if (!this.id) {
            return;
        }
        let list = document.querySelector(`ct-action-menu#${this.id} ul`);
        list.parentNode.removeChild(list);
    }
    _renderList() {
        let list = document.createElement('ul');
        this.items.forEach(e => {
            list.appendChild(this._createActionListItem(e));
        });
        this.appendChild(list);
    }
    _createMainIcon() {
        let icon = document.createElement('i');
        if (this.label.icon) {
            icon.classList.add('fa');
            icon.classList.add(this.label.icon);
        }
        return icon;
    }
    _createMainLabel() {
        let label = document.createElement('p');
        label.innerHTML = this.label.text ? this.label.text : '';
        return label;
    }
    _createToggleButton() {
        let toggleButton = document.createElement('button');
        let icon = document.createElement('i');
        icon.classList.add('fa', 'fa-chevron-down');
        toggleButton.appendChild(icon);
        toggleButton.onclick = () => {
            if (!this.menuVisible) {
                if (this.items) {
                    this._renderList();
                }
            }
            else {
                this._hideList();
            }
            this.menuVisible = !this.menuVisible;
        };
        return toggleButton;
    }
    _createActionListItem(item) {
        let listItem = document.createElement('li');
        if (item.isDivider) {
            let divider = document.createElement('hr');
            listItem.classList.add('divider');
            listItem.appendChild(divider);
        }
        else {
            let icon = document.createElement('i');
            if (item.icon) {
                icon.classList.add('fa');
                icon.classList.add(item.icon);
            }
            let text = document.createElement('p');
            text.innerHTML = item.text ? item.text : '';
            listItem.appendChild(icon);
            listItem.appendChild(text);
            if (item.isDisabled) {
                listItem.setAttribute('disabled', 'disabled');
                listItem.classList.add('disabled');
            }
            else if (item.action) {
                listItem.classList.add('has-action');
                listItem.onclick = () => {
                    Helper.executeFunction(item.action);
                };
            }
            else {
                listItem.classList.add('no-action');
            }
        }
        return listItem;
    }
}
customElements.define('ct-action-menu', CTActionMenu);
