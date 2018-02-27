// const crypto = require("crypto"),
//       request = require("request");
//
import '../shim.js';
import crypto from 'react-native-crypto';

const PayuNewOrder = function() {
    this.__main__ = {
        key: '',
        txnid: '',
        amount: '',
        productinfo: '',
        firstname: '',
        lastname: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        email: '',
        phone: 0,
        udf1: '',
        udf2: '',
        udf3: '',
        udf4: '',
        udf5: '',
        surl: '',
        furl: '',
        hash: '',
        service_provider: '',
    }; 
    this.salt = '';  
    this.madeHash = false;
    this.url = '';
};

/**
 * Adds the object properties from the argument object to the Payu main object.
 * @param {Object} payment - Properties from this object will be updated in the main object.
 */
PayuNewOrder.prototype.Create = function(payment, secure) {
    console.log(payment)
    try {
        if (payment) {
            // If it is not secure and hash is not made then we add test data.
            if (secure !== undefined && secure === false) {
                this.__main__.key = "6w6X3W";
                this.salt = "rpcWTLKv";
                this.url = "https://test.payu.in/_payment";
                // this.__main__.amount = Number.toFixed(this.__main__.amount, 2);

                
            } else {
                this.url = "https://secure.payu.in/_payment";               
                // 
            }
            if ("salt" in payment) this.salt = payment.salt;
            for (let prop in payment) {
                if (prop in this.__main__) this.__main__[prop] = payment[prop];
            }
            if ("key" in payment) this.salt = payment.salt;
            for (let prop in payment) {
                if (prop in this.__main__) this.__main__[prop] = payment[prop];
            }
            if ("udf1" in payment) this.salt = payment.salt;
            for (let prop in payment) {
                if (prop in this.__main__) this.__main__[prop] = payment[prop];
            }
        //    console.log(this.__main__.bam);
           this.__main__.amount = Number.parseFloat(this.__main__.amount).toFixed(2); 
            // console.log(this.__main__.amount);
            

        } else {
            throw new Error("Nothing to update!");
        }        
    } catch (e) {
        console.error(e);
        return false;
    }

};

// They are the same thing, name change just for semantics.
PayuNewOrder.prototype.update = PayuNewOrder.prototype.Create;


/**
 * Creates a random TXNID string of given length.
 * @param len {Number} Length of the resulting random string.
 * @returns {String} A random string of given length.
 */
PayuNewOrder.prototype.randTxn = function(len) {
    var tnid = uuid.v4();
    console.log(tnid);
    // let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // let r = "";
    // for (let i = 0; i < (len + 1); i++) r += chars[Math.floor(Math.random() * chars.length)];
    // return (r);
    return tnid;
};

/**
 * Checks if the data is valid to send a payment.
 * @returns {Boolean} A boolean value reffering if the data is acceptable or not.
 */
PayuNewOrder.prototype.checkValidity = function() {
    try {
        if (this.salt === "") {
            console.log(this.salt);
            throw new Error("'salt' parameter is empty / null!");
            return false;            
        }
        let imp = ["key", "txnid", "amount", "productinfo", "firstname", "email", "phone", "surl", "furl", "service_provider",];
        for (let i = 0; i < imp.length; i++) {
            if (this.__main__[imp[i]] === "" || this.__main__[imp[i]] === null) throw new Error("'" + imp[i] + "' parameter is empty / null!");
        }
        return true;        
    } catch (e) {
        console.error(e);
        return false;
    }
};

/**
 * Creates a hash with the given data.
 * @returns {String|Boolean} Returns the hash if valid, else returns false.
 */
PayuNewOrder.prototype.makeHash = function() {

    try {
        let hashString = "";

        // CHECK 
        if (this.__main__.txnid.length < 1) {
            this.__main__.txnid = this.randTxn(36);
            console.log("!!!ran");
        };
        let essentials = ["key", "txnid", "amount", "productinfo", "firstname", "email", "udf1", "udf2", "udf3", "udf4", "udf5"];
        if (! this.checkValidity()) throw new Error("Please make sure all cumpolsary parameters are added!");

        // MAKE
        for (ess of essentials) {
            hashString += this.__main__[ess] + "|";
        }
        hashString += "|||||" + this.salt;

        // HASH
        let hash = new crypto.createHash("sha512");
        hash.update(hashString);
        this.__main__.hash = String.prototype.toLowerCase.call(hash.digest('hex'));

        return this.__main__.hash;
    } catch (e) {
        console.error(e);
        return false;
    }    
}




/**
 * Sends this.__main__ data to payumoney.
 * @returns {Promise} Returns a promise object that resolves with a redirect url or rejects with a http page data.
 */
PayuNewOrder.prototype.sendReq = function() {
        const headers = {
           'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        };

        var data = this.__main__;

        const url = this.url;

        if (this.makeHash()) {

             console.log(data);
        //array that holds the items that get added into the form

            var form = [];

        //special handling for object/array data, arrays will use "model" as the container ns
            addItemsToForm(form, typeof data == 'object' ? [] : [options.name || 'model'], data);
            console.log(form.join('&'));
        
        return fetch(url, { 
                        method: 'post',
                        headers: {
                        'Accept': 'application/json, application/xml, text/play, text/html, *.*',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                        },
                        body: form.join('&')})
            .then(response => {
                if (response.ok) {
                    response.data = data;
                    return Promise.resolve(response)
                }
                 return Promise.reject('error')
            }).catch(error => {
                 return Promise.reject(error.message)
            })
        } else {
            return Promise.reject("Error!");
        }


        function addItemsToForm(form, names, obj) {
  if (obj === undefined || obj === "" || obj === null) return addItemToForm(form, names, "");

  if (
    typeof obj == "string"
    || obj === true 
    || obj === false
  ) return addItemToForm(form, names, obj);

    if (
    typeof obj == "number" 
  ) return addNumberToForm(form, names, obj);

  if (obj instanceof Date) return addItemToForm(form, names, obj.toJSON());

  // array or otherwise array-like
  if (obj instanceof Array) {
    return obj.forEach((v,i) => {
      names.push(`[${i}]`);
      addItemsToForm(form, names, v);
      names.pop();
    });
  }

  if (typeof obj === "object") {
    return Object.keys(obj).forEach((k)=>{
      names.push(k);
      addItemsToForm(form, names, obj[k]);
      names.pop();
    });
  }
}
function addItemToForm(form, names, value) {
  var name = encodeURIComponent(names.join('.').replace(/\.\[/g, '['));
  value = encodeURIComponent(value.toString());
  form.push(`${name}=${value}`);
}

function addNumberToForm(form, names, value) {
  var name = encodeURIComponent(names.join('.').replace(/\.\[/g, '['));
  value = encodeURIComponent(value);
  form.push(`${name}=${value}`);
}

};


module.exports = {
    newOrder: new PayuNewOrder(),
};