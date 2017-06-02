/** all classes extends the abstract class.
 * @abstract
 */
class Utils {

    static snakeCaseToCamelCase(s) {
        return s.replace(/(\-\w)/g, function(m){return m[1].toUpperCase();});
    }
}

module.exports = Utils;