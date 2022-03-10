const {
    validateEmail
} = require('../utils/helper');



describe("Basic Jest Email String Test", () => {
    it("Returns is email is validate", () => {
        // Running the function
        test0 = validateEmail('yash@gmail.com')
        test1 = validateEmail('test')
        expect(test0).toEqual(true);
        expect(test1).toEqual(false);
    })
});