+++
title = "Implementing Custom Controls With UIMenu in UIKit"
taxonomies.tags = ['Swift', 'UIKit', 'UIMenu']
description = "How to create custom controls which acts like a UIButton with an associated menu"
authors = ['Umur Gedik']
template = "blog/article.html"
+++

Recently I was working on a client project with a custom control in a navigation bar to show the associated menu on tap. UIKit supports this behavior out of the box with `UIButton` when you associate an `UIMenu` and set it's `showsMenuAsPrimaryAction`. 

<div class="overlay-container">

```swift
let button = UIButton(type: .system)
button.setTitle("Menu Button", for: .normal)
button.menu = UIMenu(
    children: [
        UIAction(
            title: "Command 1",
            handler: { _ in }
        )
    ]
)

button.showsMenuAsPrimaryAction = true
```

<video class="overlay-tr" width="365" autoplay loop playsinline disablepictureinpicture disableremoteplayback id="video-1">
    <source src="uibutton_menu.mp4" type="video/mp4">
    <source src="uibutton_menu.webm" type="video/webm">
</video>
</div>


If all you need is a simple button with a menu, use `UIButton` by all means. If you want to have this behavior on your custom view it need to extend `UIControl` instead of `UIView`. Unfortunately there is no `.menu` property on `UIControl` class.

Another way to showing menus is adding an `UIContextMenuInteraction` to your view. But context menu interaction is triggered by long press gesture, and also it adds custom styling to your view while the long press gesture in progress. As the name suggests it is a context menu after all.

<div class="overlay-container">

```swift
let label = UILabel()
label.text = "A Label"

let interaction = UIContextMenuInteraction(delegate: self)
label.addInteraction(interaction)
label.isUserInteractionEnabled = true

extension ViewController: UIContextMenuInteractionDelegate {
    func contextMenuInteraction(
        _ interaction: UIContextMenuInteraction,
        configurationForMenuAtLocation location: CGPoint
    ) -> UIContextMenuConfiguration? {
        UIContextMenuConfiguration(actionProvider: { suggestions in
            let actions = [
                UIAction(
                    title: "Command 1",
                    handler: { _ in }
                )
            ]

            return UIMenu(children: actions)
        })
    }
}
```

<video class="overlay-tr" width="250" autoplay loop playsinline disablepictureinpicture disableremoteplayback id="video-1">
    <source src="context_menu.mp4" type="video/mp4">
    <source src="context_menu.webm" type="video/webm">
</video>
</div>

`UIControl` has a special treatment for `UIContextMenuInteraction`. If we extend our custom view from `UIControl` and enable context menu interaction via `isContextMenuInteractionEnabled` and `showsMenuAsPrimaryAction` we can achieve the same behavior as `UIButton` has. 


<div class="overlay-container">

```swift
class CustomView: UIControl {
    func setupViews() {
        let label = UILabel()
        label.text = "A Label"
        addSubview(label)

        // setup layout constraints...

        // Enable context menu interaction
        isContextMenuInteractionEnabled = true
        showsMenuAsPrimaryAction = true
    }

    lazy var menuConfig = UIContextMenuConfiguration(actionProvider: {
        suggestedActions in
        let actions = [
            UIAction(
                title: "Command 1",
                handler: { _ in }
            )
        ]

        return UIMenu(children: actions)
    })

    override func contextMenuInteraction(
        _ interaction: UIContextMenuInteraction,
        configurationForMenuAtLocation location: CGPoint
    ) -> UIContextMenuConfiguration? {
        menuConfig
    }
}
```

<video class="overlay-tr" width="300" autoplay loop playsinline disablepictureinpicture disableremoteplayback id="video-1">
    <source src="uicontrol_menu.mp4" type="video/mp4">
    <source src="uicontrol_menu.webm" type="video/webm">
</video>
</div>

Keep in mind `UIControl` already conforms to `UIContextMenuInteractionDelegate` protocol, and `isContextMenuInteractionEnabled` property automatically adds `UIContextMenuInteraction` to the control. Make sure to check the [delegate protocol](https://developer.apple.com/documentation/uikit/uicontextmenuinteractiondelegate) for further customizations of the interaction.
