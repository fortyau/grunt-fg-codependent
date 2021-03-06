//var deps = {
//    "dependencies":{
//        "scripts":[
//            JSON.stringify(
//                _.map(deps.js, function(dep){
//                    return {
//                        "name": dep.name,
//                        "version": dep.version,
//                        "verify_presence": dep.func,
//                        "verify_version":dep.version_test,
//                        "src": dep.src,
//                        "prerequisite":dep.prerequisite
//                    };
//                    }
//                ).join(','))
//],
//"stylesheets":[
//    _.forEach(deps.css, function(dep){
//    {
//        "name": "{%- dep.name %}",
//        "version": "{%- dep.version %}",
//        "src": "{%- dep.src %}"
//    }
//    });
//]
//}
//}


//var loadonater = {
//
//
//    // Create a object to save off some data.
//    // We will save the names of each resource that we are injecting. This will be refrenced in a function below
//    create_resource_library: function() {
//        if  (typeof loadonater_resource_library == "undefined") {
//
//            // Yeah, a global scope... whats it to you? we need this here.
//            loadonater_resource_library = {
//                "scripts": [],
//                "stylesheets":[]
//            }
//        }
//
//        return
//    },
//
//
//    // Make new_resource
//    add_new_resource_to_library: function(type, name, version, loaded) {
//        var new_resource = {
//            "name": name,
//            "version": version,
//            "loaded": loaded
//        }
//
//        loadonater_resource_library[type].push(new_resource)
//        return new_resource
//    },
//
//
//    // Find a match in loadonater_resource_library.
//    get_resource_object: function(type, name) {
//        var resource_object = null
//
//        for (var available_resource in loadonater_resource_library[type]) {
//            if (name == loadonater_resource_library[type][available_resource].name) {
//                resource_object = loadonater_resource_library[type][available_resource]
//            }
//        }
//
//        return resource_object
//    },
//
//
//    // We manually add the data to the loadonater_resource_library object as we are loading them.
//    // This returns true or false if we have recorded a resource loaded.
//    is_resource_being_loaded: function(type, name) {
//        injected_resource = loadonater.get_resource_object(type, name)
//
//        if (injected_resource) {
//            return true
//        }
//
//        return false;
//    },
//
//
//    // Take a dependency_group, this will be regular old dependencies or dev dependencies,
//    // loop through them, and inject the project_resources into the page
//    process_project_dependencies: function(dependencies, callback) {
//        loadonater.create_resource_library()
//
//        // These dependency will be scripts, or stylesheets
//        for (var dependency_type in dependencies) {
//            // set variables
//            // console.log ("dependency_type is: " + dependency_type)
//
//            var library_set = dependencies[dependency_type]
//
//            // loop through all of the libs, no matter what the type
//            for (var library in library_set) {
//
//                var resource = library_set[library]
//                // console.log (resource.name)
//
//                if (dependency_type == 'scripts') {
//                    loadonater.process_js(resource)
//                }
//
//                if (dependency_type == 'stylesheets') {
//                    loadonater.process_css(resource)
//                }
//
//            }
//        }
//
//
//        function return_callback_when_all_resources_loaded() {
//            if ( loadonater.verify_all_resources_loaded() ) {
//                return callback()
//            } else {
//                setTimeout(function() {
//                    return_callback_when_all_resources_loaded()
//                }, 100)
//            }
//        }
//
//        return_callback_when_all_resources_loaded()
//
//    },
//
//
//    verify_all_resources_loaded: function() {
//        for (var resource_type in loadonater_resource_library) {
//            var scripts_or_stylesheets = loadonater_resource_library[resource_type]
//            for (var resource in scripts_or_stylesheets) {
//                if (!scripts_or_stylesheets[resource].loaded) {
//                    return false
//                }
//            }
//        }
//
//        return true
//    },
//
//
//    process_js: function(resource) {
//        resource_present = eval(resource.verify_presence)
//        resource_loading = loadonater.is_resource_being_loaded("scripts", resource.name)
//
//        // If a resource is present in the dom, We will add it to loadonater_resource_library
//        // If a second application is running lodonater and requests a similar resource, this resource should only be added once.
//        if (resource_present) {
//            if (loadonater.get_resource_object("scripts", resource.name) == null) {
//                resource_version = eval(resource.verify_version)
//                loadonater.add_new_resource_to_library("scripts", resource.name, resource_version, true)
//            }
//        }
//
//        if (!resource_present && !resource_loading) {
//            loadonater.load_now_or_later(resource)
//        } else {
//            // Check for a mis match in version. We will have a pre-loaded resource
//            // OR another instance of loadonater is requesting a similar resource to be loaded.
//            var pre_existing_resource = loadonater.get_resource_object("scripts", resource.name)
//            if (pre_existing_resource.version !== resource.version){
//                console.log ("Version Mismatch: Application requires version "+ resource.version +" of "+ resource.name +", version "+ pre_existing_resource.version +" loaded already!")
//            }
//        }
//
//        return
//    },
//
//
//    // Make a decision on when to inject the JS based on if it has prerequisites.
//    load_now_or_later: function(resource) {
//        if (resource.prerequisite != undefined) {
//            var our_prerequisite = loadonater.get_resource_object("scripts", resource.prerequisite)
//
//            function wait_until_prerequisite_loaded() {
//                if (our_prerequisite.loaded) {
//                    loadonater.inject_js(resource)
//                } else {
//                    setTimeout(function() {
//                        wait_until_prerequisite_loaded()
//                    }, 100)
//                }
//            }
//
//            wait_until_prerequisite_loaded()
//        } else {
//            loadonater.inject_js(resource)
//        }
//
//        return
//    },
//
//
//    inject_js: function(resource) {
//        // Document that we are injecting the resource. make it not loaded.
//        var our_object = loadonater.add_new_resource_to_library("scripts", resource.name, resource.version, false)
//
//        var head= document.getElementsByTagName('head')[0];
//        var script= document.createElement('script');
//        script.type= 'text/javascript';
//        script.src= resource.src;
//        script.onload= function(){our_object.loaded = true}
//        script.async= true;
//        head.appendChild(script);
//
//        return
//    },
//
//
//    process_css: function(resource) {
//        var we_need_to_load_this_resource = true
//
//        resource_present = loadonater.css_resource_in_dom(resource.name)
//        resource_loading = loadonater.is_resource_being_loaded("stylesheets", resource.name)
//
//        if (resource_present || resource_loading) {
//            we_need_to_load_this_resource = false
//            // console.log("CSS resource " + resource.name + " present or being loaded")
//        }
//
//        if (we_need_to_load_this_resource) {
//            loadonater.inject_css(resource)
//            // console.log ("injecting css resource " + resource.name + " version " + resource.version + " into page")
//        }
//
//        return
//    },
//
//
//    get_all_css_file_names: function() {
//        var return_array = []
//
//        for(var i = 0; i < document.styleSheets.length; i++) {
//            return_array.push(document.styleSheets[i].href);
//        }
//
//        return return_array
//    },
//
//
//    css_resource_in_dom: function(resource_name) {
//        var css_resources = loadonater.get_all_css_file_names();
//
//        for(var i = 0; i < css_resources.length; i++) {
//            if(css_resources[i].indexOf(resource_name) != -1 ) {
//                // console.log ("css resource " + resource_name + " found in dom")
//                return true;
//            }
//        }
//
//        return false
//    },
//
//
//    inject_css: function(resource){
//        loadonater.add_new_resource_to_library("stylesheets", resource.name, resource.version, true)
//
//        var dom_element = document.createElement("link")
//        dom_element.setAttribute("rel", "stylesheet")
//        dom_element.setAttribute("type", "text/css")
//        dom_element.setAttribute("href", resource.src)
//
//        if (typeof dom_element!="undefined") {
//            document.getElementsByTagName("head")[0].appendChild(dom_element)
//        }
//
//        return
//    }
//
//
//};
//
//
//// Kick it all off.
//loadonater.process_project_dependencies(dependencies, make_chart);