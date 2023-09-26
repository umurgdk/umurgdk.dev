+++
title = "Uploading files with URLSession using multipart requests"
description = "How to encode multipart/form-data with swift to upload files alongside with other parameters"
authors = ['Umur Gedik']
taxonomies.tags = ['Swift', 'URLSession', 'multipart/form-data', 'file upload', 'Alamofire']
template = "blog/article.html"
+++

While working on my macOS Mastodon client Fil, I needed to upload media files to post statuses with images and videos attached. Mastodon API allows file uploads with `multipart/form-data` encoded http request body. If you ever develop web applications with forms in it, this is what basically browsers do that when you have files in your forms by default. Encoding is pretty straight forward and a simple implementation in swift doesn't takes more than 30 lines of code. So instead of including Alamofire in your next project just to support file uploads, you can write it yourself or copy paste the one I share in this post.

Multipart/form-data requests consist of a magic **boundary** value and list of values (form fields) separated by that boundary in the body of the request. Boundary acts as a field separator, so that the server can understand where each field begins and ends. This is espacially important since these types of requests usually embeds binary data in the body of the request, so that simple new line characters like `\r\n` may not be sufficient.

A simple request representing two `String` fields (`title` and `description`) may look like this:
```http
POST /upload/image HTTP/1.1
Host: api.example.com
Content-Type: multipart/form-data; charset=utf-8; boundary=__MY_MAGIC_IDENTIFIER__

--__MY_MAGIC_IDENTIFIER
Content-Disposition: form-data; name="title"

My blog title
--__MY_MAGIC_IDENTIFIER
Content-Disposition: form-data; name="description"

Some description about my blog
--__MY_MAGIC_IDENTIFIER--
```

In this example `Content-Type` is set to `multipart/form-data` with utf8 encoding and the boundary is defined as `__MY_MAGIC_IDENTIFIER__`, but you can choose your own identifier. In my app this is set to `__X_FIL_MULTIPART_BOUNDARY__`. Also the underscores are optional and stylistic in these examples.

Actual `httpBody` of the `URLRequest` starts just after the empty line after the headers. In this example the body starts with the **boundary separator**. Boundary separators are the magic boundary identifier prefixed with 2 dashes "`--`". After the separator, we should define which field of the form data we are going to include with `Content-Disposition` attribute. It's format self explanatory, and arguments (just like headers) are separated with "`;`" character. For string encoded fields this definition is sufficient, but for file fields, file name can be defined with `filename="myfile.jpg"` argument.

After all the form fields `httpBody` should include a terminator to indicate there are no more data is provided. Terminator is the magic boundary identifier surrounded with 2 dashes "`--`" on both sides; like "`--__MY_MAGIC_IDENTIFIER__--`". Make sure this terminator is only included at the end of the body, and do not put "`--`" at the end of the **field separators**.

We can create a swift struct to abstract these details from our networking code. To start with supporting string fields:

```swift
// MultipartFormData.swift

struct MultipartFormData {
    public let boundary = "__MY_MAGIC_IDENTIFIER__"
    private var data = Data()

    public var contentType: String {
        "multipart/form-data; charset=utf-8; boundary=\(boundary)"
    }

    mutating func addString(_ value: String, forField field: String) {
        var fieldString = "--\(boundary)\r\n"
        fieldString += "Content-Disposition: form-data; name=\"\(key)\"\r\n"
        fieldString += "Content-Type: text/plain; charset=utf-8\r\n"
        fieldString += "\r\n"
        fieldString += "\(string)\r\n"

        data.append(fieldString.data(using: .utf8)!)
    }

    mutating func makeBody() -> Data {
        let terminator = "--\(boundary)--"
        data.append(terminator.data(encoding: .utf8)!)
        return data
    }
}
```

As you may notice, instead of "`\n`" HTTP use "`\r\n`" for empty lines. Every field immediately starts with the **boundary separator** end ends with an empty line. And the **terminator** in the `makeBody` method does not includes an empty line at the end. We can use this helper with `URLSession` as:

```swift
var formData = MultipartFormData()
formData.addString("Umur Gedik", forField: "name")
formData.addString("Turkey", forField: "location")

var req = URLRequest(url: myApiUrl)
req.setValue(formData.contentType, forHTTPHeaderField: "Content-Type")
req.httpBody = formData.makeBody()

let (data, response) = try await URLSession.shared.data(for: req)
```

Adding support for file uploads are not that difficult. It requires an additional `Content-Type` attribute for the file field to let the server know what kind of file data we are sending. An example HTTP request including a file looks like this:

```http
POST /upload/image HTTP/1.1
Host: api.example.com
Content-Type: multipart/form-data; charset=utf-8; boundary=__MY_MAGIC_IDENTIFIER__

--__MY_MAGIC_IDENTIFIER
Content-Disposition: form-data; name="name"

Umur Gedik
--__MY_MAGIC_IDENTIFIER
Content-Disposition: form-data; name="avatar"; filename="avatar.jpg"
Content-Type: image/jpeg

<BINARY JPEG DATA IS NOT SHOWN HERE>
--__MY_MAGIC_IDENTIFIER--
```

Implementation in our `MultipartFormData` should append the given `Data` as it is to the body after the separator and the `Content-Disposition` like:

```swift
// MultipartFormData.swift

struct MultipartFormData {
    // ...
    mutating func addFile(named name: String, data fileData: String, mimeType: String, forField field: String) {
        var fieldString = "--\(boundary)\r\n"

        // Here we add filename as well
        fieldString += "Content-Disposition: form-data; name=\"\(key)\"; filename="\(name)"\r\n"
        fieldString += "Content-Type: \(mimeType)\r\n"
        fieldString += "\r\n"

        data.append(fieldString.data(using: .utf8)!)

        // we append the given file data as it is immediately after the details
        data.append(fileData)
        data.append("\r\n".data(using: .utf8)!)
    }

    // ...
}
```

`addFile` method introduces `filename` and `mimeType` to inform the server about the details of our file to upload. `mimeType` can be found by `UTType` in `UniformTypeIdentifiers` module. Example usage may look like this:

```swift
import UniformTypeIdentifiers

var formData = MultipartFormData()
formData.addString("Umur Gedik", forField: "name")
formData.addString("Turkey", forField: "location")

// assuming we have a file URL
let data = try Data(contentsOf: fileURL)
let typeIdentifier = UTType(filenameExtension: url.pathExtension)
let mimeType = typeIdentifier.preferredMIMEType

formData.addFile(named: fileURL.lastPathComponent, data: data, mimeType: mimeType, forField: "avatar")

var req = URLRequest(url: myApiUrl)
req.setValue(formData.contentType, forHTTPHeaderField: "Content-Type")
req.httpBody = formData.makeBody()

let (data, response) = try await URLSession.shared.data(for: req)
```

For the reference here is the full implementation of our `MultipartFormData`:

```swift
// MultipartFormData.swift

struct MultipartFormData {
    public let boundary = "__MY_MAGIC_IDENTIFIER__"
    private var data = Data()

    public var contentType: String {
        "multipart/form-data; charset=utf-8; boundary=\(boundary)"
    }

    mutating func addString(_ value: String, forField field: String) {
        var fieldString = "--\(boundary)\r\n"
        fieldString += "Content-Disposition: form-data; name=\"\(key)\"\r\n"
        fieldString += "Content-Type: text/plain; charset=utf-8\r\n"
        fieldString += "\r\n"
        fieldString += "\(string)\r\n"

        data.append(fieldString.data(using: .utf8)!)
    }

    mutating func addFile(named name: String, data fileData: String, mimeType: String, forField field: String) {
        var fieldString = "--\(boundary)\r\n"

        // Here we add filename as well
        fieldString += "Content-Disposition: form-data; name=\"\(key)\"; filename="\(name)"\r\n"
        fieldString += "Content-Type: \(mimeType)\r\n"
        fieldString += "\r\n"

        data.append(fieldString.data(using: .utf8)!)

        // we append the given file data as it is immediately after the details
        data.append(fileData)
        data.append("\r\n".data(using: .utf8)!)
    }

    mutating func makeBody() -> Data {
        let terminator = "--\(boundary)--"
        data.append(terminator.data(encoding: .utf8)!)
        return data
    }
}
```