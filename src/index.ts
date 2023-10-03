import Handlebars from "handlebars";
const entryTemplate = require("./templates/entry.hbs");
const geneCategoryTemplate = require("./templates/gene_category.hbs");
const geneInfoTemplate = require("./templates/gene_info.hbs");

function updateGeneListener()
{
	document.querySelectorAll<HTMLButtonElement>(".add_gene_button").forEach(
		element => {
			element.onclick = () => {
				if(element.nextElementSibling)
				{
					element.nextElementSibling.innerHTML += geneInfoTemplate();
				}
			};
		}
	); 		
}

document.querySelectorAll<HTMLButtonElement>(".add_gene_category_button").forEach(
element => {
	element.addEventListener("click", () => {
		let gene_category_container = document.getElementById("gene_category_container");
		if(gene_category_container)
		{
			gene_category_container.innerHTML += geneCategoryTemplate();
			updateGeneListener();
		}
	});
}); 

const convertBase64 = (file: File) => {
    return new Promise<string|ArrayBuffer|null>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

document.querySelectorAll<HTMLButtonElement>(".add_creatore").forEach(element => {
	element.addEventListener("click", async () => 
	{
		let ImgURL: string|ArrayBuffer|null = null;
		let ImgURLElements = document.getElementsByName("ImgURL");
		if(ImgURLElements.length > 0)
		{
			let file = (ImgURLElements[0] as HTMLInputElement).files?.[0];
			if(file)
			{
				ImgURL = await convertBase64(file);
			}
		}

		let Name = (document.getElementsByName("Name")[0] as HTMLInputElement).value;
		let GenderCheck = (document.getElementsByName("GenderCheck")[0] as HTMLInputElement).checked;

		let GeneList = [];

		let GeneCategoryInput = document.getElementById("gene_category_container");
		if(GeneCategoryInput)
		{
			for (let i = 0; i < GeneCategoryInput.children.length; i++) 
			{
				let GeneCategory = GeneCategoryInput.children[i] as HTMLElement;
				let GeneComp = GeneCategory.querySelector<HTMLInputElement>(".gene_category")?.value;
				let GeneSpecs = [];

				let GeneContainer = GeneCategory.querySelector<HTMLElement>(".gene_container");
				if(GeneContainer)
				{
					for (let i = 0; i < GeneContainer.children.length; i++) 
					{
						let GeneInfo = GeneContainer.children[i] as HTMLElement;
						let Spec = GeneInfo.querySelector<HTMLInputElement>(".gene_name")?.value;
						let GenderCheck = GeneInfo.querySelector<HTMLInputElement>(".gender_check")?.checked;
						let GeneSpec = {
							Spec,
							GenderCheck
						};
						GeneSpecs.push(GeneSpec);
					}
				}

				GeneList.push({
					GeneComp,
					GeneSpecs
				})
			}
		}

		let checklist = document.getElementById("check_list");
		if(checklist)
		{
			checklist.innerHTML += entryTemplate({
				ImgURL: ImgURL,
				Name: Name,
				GenderCheck: GenderCheck,
				GeneList: GeneList
			});
		}

	});
}); 