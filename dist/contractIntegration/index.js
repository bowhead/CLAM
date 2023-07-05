"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryInteraction = exports.Interaction = exports.IPFSManagementInteraction = exports.AccessInteraction = exports.ConsentInteraction = exports.Access = exports.Consent = void 0;
require("reflect-metadata");
const accessInteraction_1 = require("./accessInteraction/");
Object.defineProperty(exports, "Access", { enumerable: true, get: function () { return accessInteraction_1.Access; } });
Object.defineProperty(exports, "AccessInteraction", { enumerable: true, get: function () { return accessInteraction_1.AccessInteraction; } });
const consentInteraction_1 = require("./consentInteraction");
Object.defineProperty(exports, "Consent", { enumerable: true, get: function () { return consentInteraction_1.Consent; } });
Object.defineProperty(exports, "ConsentInteraction", { enumerable: true, get: function () { return consentInteraction_1.ConsentInteraction; } });
const interaction_1 = require("./interaction");
Object.defineProperty(exports, "Interaction", { enumerable: true, get: function () { return interaction_1.Interaction; } });
Object.defineProperty(exports, "FactoryInteraction", { enumerable: true, get: function () { return interaction_1.FactoryInteraction; } });
const IPFSManagementInteraction_1 = require("./IPFSManagementInteraction");
Object.defineProperty(exports, "IPFSManagementInteraction", { enumerable: true, get: function () { return IPFSManagementInteraction_1.IPFSManagementInteraction; } });
//# sourceMappingURL=index.js.map