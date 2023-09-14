+++
title = 'Distribute macOS Applications as DMG Images'
description = 'Step by step guide to creating notarized .dmg files for macOS apps.'
authors = ['Umur Gedik']
taxonomies.tags = ['Xcode', 'Deployment', 'macOS', 'notarization']
template = "blog/article.html"
+++

Distributing apps as  `.dmg` files requires the developer to sign the `.dmg` file with a Developer ID Application certificate and notarizing it.

## Prerequirements

- A provisioning profile and certificate with type  Developer ID Application
- https://developer.apple.com > Account > Certificates, IDs & Profiles > Profiles
- Install the certificate in your Keychain (double clicking the certificate file will install)
- Make sure you use the correct provisioning profile to build your archive

## Archiving

Archive your application in Xcode by Product > Archive. When archive build is complete Xcode will open a window called **Organizer** (Xcode menu Window > Organizer) where you can sign and export your  `.app` file.

Click  Distribute App and then select  Developer ID as your method of distribution. In the next screen select **Export** (sign without notarization) as your destination, we will notarize the `.dmg` file not the `.app` export.

## Creating DMG

1.  You can use **Disk Utilities** app in your mac to create an empty  `.sparsebundle` disk image
2.  Mount the disk image (double-click) and open the volume (should be listed at Finder’s sidebar)
3.  Configure the display options of the finder like; show as icons, icon size, snap to grid, and background.
4.  Don’t forget to create a link to  `/Applications` directory to easy drag n drop install
5.  Close the finder window when it looks good
6.  Get back to **Disk Utility** app and show select **Show All Devices** from the sidebar icon
7.  On the sidebar find the mounted sparsebundle image
8.  Right-Click and select create image on the  container and choose compressed and save as .dmg

## Signing and Notarizing

First we need to sign  `.dmg` file just like the  `.app`. These commands doesn't produce any output when it is successfull.

```
# Sign the .dmg file with the certificate mentioned in the prerequirements section
$ codesign --sign "Developer ID Application: <Your Name> (Team ID)" path/to/application.dmg
$ codesign --verify path/to/application.dmg
```

To notarize the `.dmg` we need to run  notarytool. notary tool requires either AppStoreConnect API Key or an application specific password. As you may guessed API key can be obtained from App Store Connect page. Application specific password can be created at Apple ID.

```
# If you are using application specific password
$ xcrun notarytool submit --wait --apple-id "<apple-id-email>" --password "<app-specific-password>" --team-id TEAM_ID MyApp.dmg

# If you are using API key
$ xcrun notarytool submit --wait --key <path-to-key-file> --key-id <10 char key id> --issuer <issuer id UUID> MyApp.dmg
> Successfully received submission info
>   createdDate: 2023-09-11T19:38:24.532Z
>   id: 4667a4a7-xxxx-xxxx-xxxx-d83eb3124f84
>   name: MyApp.dmg
>   status: Accepted

# If you don't want to wait until the notarization complete ommit --wait parameter
# In that case output will contain the submit ID you can use that ID to query
# the status of the notarization
```

After the notarization is complete and status is **Accepted**, `.dmg` file needs to be stapled. Apple notarization process creates a ticket after a successful submit. To attach that ticket to our application (in this case our .dmg file):

```
$ xcrun stapler staple MyApp.dmg

# To test signing & notarization is successful
$ spctl -a -t open --context context:primary-signature -v MyApp.dmg

> MyApp.dmg: accepted
> source=Notarized Developer ID
```

If the output from  `spctl` command is different (as in rejected) you maybe skip a step, please make sure everything is done in order.

Happy deployments!
