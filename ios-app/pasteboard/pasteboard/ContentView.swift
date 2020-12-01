//
//  ContentView.swift
//  pasteboard
//
//  Created by Nick Funk on 11/30/20.
//

import SwiftUI
import WebKit;
import Foundation;

class LocalStorage {
    private static let key: String = "pasteboard_store";
    
    public static var value: String {
        set {
            UserDefaults.standard.set(newValue, forKey: key)
        }
        get {
            return UserDefaults.standard.string(forKey: key) ?? ""
        }
    }
    
    public static func removeValue() {
        UserDefaults.standard.removeObject(forKey: key)
    }
}

class Site {
    public var name: String;
    public var url: String;
    
    init(name: String, url: String) {
        self.name = name;
        self.url = url;
    }
}

class ObservedSites: ObservableObject {
    @Published public var values: [Site] = [];
}

class SiteCollection {
    @ObservedObject public var sites: ObservedSites = ObservedSites();
    
    init() {
        load();
    }
    
    func add(name: String, url: String) {
        self.sites.values.append(Site.init(name: name, url: url));
        
        serialize();
    }
    
    func remove(name: String) {
        if let index = self.sites.values.firstIndex(where: {
            site in
            return site.name == name
        }) {
            self.sites.values.remove(at: index)
        }
        
        serialize();
    }
    
    func serialize() {
        var keyValue: String = "";
        for site in self.sites.values {
            keyValue.append(site.name + "," + site.url + ",");
        }
        
        LocalStorage.value = keyValue;
    }
    
    func load() {
        let raw = LocalStorage.value;
        let values = raw.components(separatedBy: ",").filter {
            value in
            value.count > 0
        };
        
        if (values.count < 2) {
            return;
        }
        
        for i in 0..<values.count {
            if (i % 2 == 0) {
                let name = values[i];
                let url = values[i + 1];
                
                self.add(name: name, url: url);
            }
        }
    }
}

final class WebViewWrapper : UIViewRepresentable {
    private var view = WKWebView();
    
    init() {
    }
    
    func makeUIView(context: Context) -> WKWebView {
        self.view = WKWebView();
        return self.view;
    }
    
    func navigateTo(url: URL) {
        let request = URLRequest(url: url);
        self.view.load(request);
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
        
    }
}

class ObservedText: ObservableObject {
    @Published var value = ""
}

struct AddSiteView : View {
    @ObservedObject public var _name = ObservedText()
    @ObservedObject public var _url = ObservedText()
    
    var body: some View {
        VStack {
            Text("Name")
            TextField("name", text: Binding(
                get: {
                    return self._name.value;
                },
                set: {
                    newValue in
                    return self._name.value = newValue;
                }
            ))
            Text("URL")
            TextField("url", text: Binding(
                get: {
                    return self._url.value;
                },
                set: {
                    newValue in
                    return self._url.value = newValue;
                }
            ))
        }
    }
    
    func name() -> String {
        return self._name.value;
    }
    
    func url() -> String {
        return self._url.value;
    }
}

struct ContentView: View {
    @State private var webView = WebViewWrapper()
    private var siteCollection = SiteCollection()
    @State private var addSite = AddSiteView()
    @State private var showAddSite = false;
    
    var body: some View {
        VStack {
            Text("Pasteboard")
            HStack {
                ForEach(self.siteCollection.sites.values, id: \.url) { site in
                    HStack {
                        Button(action: {
                            let url: String = site.url;
                            self.webView.navigateTo(url: URL.init(string: url)!)
                        }) {
                            Text(site.name)
                        }
                            // Button(action: {
                            //    let name: String = site.name;
                            //    self.siteCollection.remove(name: name)
                            //    }) {
                            //        Text("-")
                            //    }
                    }.padding()
                }
                Button(action: {
                    self.showAddSite = true;
                }) {
                    Text("+")
                }.padding()
            }
            self.webView
        }
        .sheet(isPresented: $showAddSite) {
            self.addSite
            Button(action: {
                let name: String = self.addSite.name();
                let url: String = self.addSite.url();

                self.siteCollection.add(name: name, url: url);
                self.showAddSite = false;
            }) {
                Text("Add Site")
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    let urlRequest: URLRequest
    
    static var previews: some View {
        ContentView()
    }
}
