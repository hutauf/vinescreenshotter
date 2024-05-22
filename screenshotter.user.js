// ==UserScript==
// @name         Copy ASIN Products Screenshot with ASIN Text
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Capture and copy ASIN products with images as a screenshot, replacing button text with ASINs in a fixed grid layout of 1000px width
// @author       You
// @match        https://www.amazon.de/*
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to capture ASIN products and copy them to the clipboard
    function captureAndCopyScreenshot() {
        const asinElements = document.querySelectorAll('.vvp-item-tile'); // Target the ASIN product elements

        if (asinElements.length > 0) {
            // Create a container to hold all ASIN elements for screenshot
            const container = document.createElement('div');
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(4, 250px)'; // Ensure 4 elements per row with fixed width
            container.style.gap = '10px';
            container.style.backgroundColor = '#fff'; // Ensure background color is set
            container.style.padding = '10px';
            container.style.width = '1000px'; // Set the total width to 1000px

            asinElements.forEach(element => {
                const clonedElement = element.cloneNode(true);
                clonedElement.style.visibility = 'visible'; // Ensure visibility
                clonedElement.style.width = '250px'; // Set each item width to 250px

                // Replace the button text with the ASIN
                const asin = element.querySelector('input[data-asin]').getAttribute('data-asin');
                const buttonText = clonedElement.querySelector('.a-button-text');
                if (buttonText) {
                    buttonText.textContent = asin; // Set the button text to the ASIN
                }

                container.appendChild(clonedElement);
            });

            document.body.appendChild(container);

            html2canvas(container, { useCORS: true }).then(canvas => {
                canvas.toBlob(blob => {
                    const item = new ClipboardItem({ "image/png": blob });
                    navigator.clipboard.write([item]).then(() => {
                        
                    }).catch(err => {
                        console.error('Failed to copy screenshot: ', err);
                    });
                });

                // Remove the temporary container
                document.body.removeChild(container);
            });
        } else {
            alert('No ASIN products found on this page.');
        }
    }

    // Function to create and add the button to the page
    function addButton() {
        const buttonContainer = document.querySelector('.vvp-header-links-container');
        if (buttonContainer) {
            const newButton = document.createElement('li');
            newButton.id = 'vvp-screenshot-link';
            newButton.className = 'vvp-header-link';
            newButton.innerHTML = '<a href="javascript:void(0)" role="button" class="a-popover-trigger a-declarative vvp-hide-popover-icon">Copy Screenshot</a>';
            newButton.addEventListener('click', captureAndCopyScreenshot);
            buttonContainer.appendChild(newButton);
        }
    }

    // Wait for the page to fully load before adding the button
    window.addEventListener('load', addButton);

})();
