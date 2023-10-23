// Event listener for the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  // Retrieving the download button and file input elements
  const downloadButton = document.getElementById("downloadButton");
  const fileInput = document.getElementById("loadUrls");

  // Adding click and change event listeners

  // Event listener for download button click
  downloadButton.addEventListener("click", function () {
    // Retrieving URLs from the URL input and initiating the download process
    const urls = document
      .getElementById("urlInput")
      .value.split("\n")
      .filter(Boolean);

    if (urls.length > 0) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: handleDownloadClick,
          args: [urls],
        });
      });
    } else {
      alert("Please insert at least one valid URL for download.");
    }
  });

  // Event listener for file input change
  fileInput.addEventListener("change", handleFileSelect);
});

// Function to handle the download button click event
function handleDownloadClick(urls) {
  // Looping through each URL and initiating the download process
  urls.forEach((url) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        var urlCreator = window.URL || window.webkitURL;
        var fileUrl = urlCreator.createObjectURL(blob);
        var fileName =
          url.substring(url.lastIndexOf("/") + 1) || "downloadedFile";

        // Creating a download link and triggering the download
        const tag = document.createElement("a");
        tag.href = fileUrl;
        tag.target = "_blank";
        tag.download = fileName;
        document.body.appendChild(tag);

        tag.click();
        document.body.removeChild(tag);
      })
      .catch((error) => {
        console.error("Error while downloading the video:", error);
        alert("Failed to download the video");
      });
  });
}

// Function to handle the file selection event
function handleFileSelect(evt) {
  // Retrieving the selected file and creating a FileReader instance
  const file = evt.target.files[0];
  const reader = new FileReader();

  // Event listener for file load event
  reader.onload = (event) => {
    // Filling the URL input with the content of the selected file
    const urlInput = document.getElementById("urlInput");
    urlInput.value = event.target.result;
  };

  // Reading the selected file as text
  reader.readAsText(file);
}
