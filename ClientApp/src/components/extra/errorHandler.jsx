
export let errorHandler = (data) => {
    let errors = [];
    for (let er in data.errors)
        errors.push(data.errors[er]);

    errors = errors.join("\n");
    return errors;
}