/*
    RoGold
    Coding and design by Alrovi Aps.
    Contact: contact@alrovi.com
    Copyright (C) Alrovi Aps
    All rights reserved.
*/

// This is not done yet so no reason to enable it :)
pages.trade = (async() => {
	return;
	const doneItems = [];
	const apiItems = {};
	const AddedValues = async () => {
		if (qs(".rg-total")) return;
		const upperValues = qsa(".trade-list-detail-offer:first-child .item-card-price .rg-value");
		const lowerValues = qsa(".trade-list-detail-offer:last-child .item-card-price .rg-value");
		if (upperValues?.length > 0 || lowerValues?.length > 0) {
			const totalUpper = upperValues.reduce((a, b) => {
				const value = parseInt(b.textContent.replace(/,/g, ""));
				return a + value;
			} , 0);
			const totalLower = lowerValues.reduce((a, b) => {
				const value = parseInt(b.textContent.replace(/,/g, ""));
				return a + value;
			} , 0);
			if (totalUpper > 0) {
				const text = qsa(".robux-line:last-child")?.[0];
				const cloned = document.createElement("div");
				cloned.className = "robux-line"
				cloned.innerHTML = `
					<span class="text-lead rg-total">Total Value</span>
					<span class="robux-line-amount"> 
						<span class="icon-robux-16x16"></span> 
						<span class="text-robux-lg robux-line-value">${addCommas(totalUpper)}</span> 
					</span>	
				`
				text.after(cloned);
			}
			if (totalLower > 0) {
				const text = qsa(".robux-line:last-child")?.[1];
				const cloned = document.createElement("div");
				cloned.className = "robux-line"
				cloned.innerHTML = `
					<span class="text-lead rg-total">Total Value</span>
					<span class="robux-line-amount"> 
						<span class="icon-robux-16x16"></span> 
						<span class="text-robux-lg robux-line-value">${addCommas(totalLower)}</span> 
					</span>	
				`
				text.after(cloned);
			}
		}
	}
	on(".trade-item-card", (card) => {
		const id = qs(".item-card-container a[href]", card)?.href.match(/\d+/)?.[0];
		if (id && !doneItems.includes(id)) doneItems.push(id);
		let interval = setInterval(() => {
			if (!apiItems[id] || !apiItems?.[id]?.ItemId) return;
			clearInterval(interval);
			const item = apiItems[id];
			if (item.Value) {
				const theme = document.getElementById('rbx-body').className.includes('light')
				const rogoldPrice = document.createElement("div");
				rogoldPrice.className = "item-card-price";
				rogoldPrice.innerHTML = `
					<div class="text-overflow item-card-price rg-value" title="Value">
						<span class="icon icon-robux-16x16 rogold-crown ${theme && "chat-light" || ""}"></span>
						<span class="text-robux ng-binding">${addCommas(item?.Value)}</span>
					</div>
				`;
				qs(".item-card-price", card).after(rogoldPrice);
			}
		}, 100);
	})
	on(".robux-line .text-lead", (text) => {
		if (text.getAttribute("ng-bind")?.includes("TotalValue")) {
			text.textContent = text.textContent.split(" ")[0] + " RAP";
			setTimeout(AddedValues, 1000);
		}
	})
	setInterval(async () => {
		const toFetch = doneItems.filter(id => !apiItems[id]);
		if (toFetch?.length == 0) return;
		toFetch.forEach(id => apiItems[id] = {});
		const bulkCheck = await get(`${toFetch.join(",")}`); // use bulk trade api
		console.log(bulkCheck);
		for (const item of bulkCheck) {
			apiItems[item.ItemId] = item;
		}
	}, 500);
})