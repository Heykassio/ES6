import api from './api';

class App {
    constructor(){
        this.repositories = [];
        this.formulario = document.getElementById('repo-form');
        this.listEl = document.getElementById('repo-list');
        this.inputEl = document.querySelector('input[name=repository]');

        this.registerHeandlers();
    }

    registerHeandlers (){
        this.formulario.onsubmit = event=> this.addRespository(event);
    }

    async addRespository (event){
        event.preventDefault();        

        const repoInput = this.inputEl.value;

        if(repoInput.length === 0) return;
        this.renderLoading();

        try{
            const response = await api.get(`/repos/${repoInput}`);

        const {name, description, html_url, owner:{ avatar_url }} = response.data;

        this.repositories.push({
            name,
            description,
            avatar_url,
            html_url,
        });

        this.inputEl.value = '';

        this.render();
        }catch(erro){
            alert(`O repositório ${repoInput} não existe!`);
            this.renderLoading(false);
        }
    }

    render(){
        this.listEl.innerHTML = '';
        this.repositories.forEach(repo=>{

            const listitem = document.createElement('li');
            const imgItem = document.createElement('img');
            const strItem = document.createElement('strong');
            const pItem = document.createElement('p');
            const linkItem = document.createElement('a');
            imgItem.setAttribute('src', repo.avatar_url);
            strItem.appendChild(document.createTextNode(repo.name));
            pItem.appendChild(document.createTextNode(repo.description));
            linkItem.setAttribute('href', repo.html_url);
            linkItem.setAttribute('target', '_blank'); //para abrir uma aba em branco
            linkItem.appendChild(document.createTextNode('Acessar'));
            listitem.appendChild(imgItem);
            listitem.appendChild(strItem);
            listitem.appendChild(pItem);
            listitem.appendChild(linkItem);
            this.listEl.appendChild(listitem);
        });
        
    }

    renderLoading(loading = true){
        if(loading){
            const liLoading = document.createElement('li');
            liLoading.setAttribute('id', 'loading');
            liLoading.appendChild(document.createTextNode('Carregando...'));
            this.listEl.appendChild(liLoading);
        }else{
            document.getElementById('loading').remove();
        }
    }
}

new App();